import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'
import { useQuery } from '@apollo/client'
import { SiweMessage } from 'siwe'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { VotePair } from '@/components/vote/VotePair'
import { Project } from '@/types/project'
import { graphqlClient } from '@/api/clients/graphql'
import { GET_ALLOWLIST_AND_PROJECTS_FROM_BUDGET_BOX } from '@/graphql/queries/project'
import { GET_VOTES } from '@/graphql/queries/vote'
import { DEFAULT_NETWORK } from '@/constants/network'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const budgetBoxId = params?.id

  const { data } = await graphqlClient.query({
    query: GET_ALLOWLIST_AND_PROJECTS_FROM_BUDGET_BOX,
    variables: {
      data: { id: budgetBoxId }
    },
    fetchPolicy: 'network-only'
  })

  const projects: Array<Project> = data?.budgetBox?.projects
  const allowlist: Array<string> = data?.budgetBox?.allowlist

  const projectsCombination = projects
    .flatMap((a, i) =>
      projects.slice(i + 1).map((b) => {
        if (0.5 - Math.random() > 0) return { alpha: a, beta: b }
        return { alpha: b, beta: a }
      })
    )
    .sort(() => 0.5 - Math.random())

  return {
    props: {
      pairs: projectsCombination,
      allowlist
    }
  }
}

interface VotePair {
  alpha: Project
  beta: Project
}

interface IVote {
  pairs: Array<VotePair>
  projects: Array<Project>
  allowlist: Array<string>
}

const Vote = ({ pairs, allowlist }: IVote) => {
  const [pagination, setPagination] = useState<number>(0)
  const [votes, setVotes] = useState<Array<string>>(
    Array(pairs.length).fill('')
  )
  const [voted, setVoted] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false)
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false)
  const [isSignLoading, setIsSignLoading] = useState<boolean>(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false)
  const [alreadyVoted, setAlreadyVoted] = useState<boolean | null>(null)
  const [nonce, setNonce] = useState<string | undefined>('')

  const { alpha, beta } = pairs[pagination] || { alpha: '', beta: '' }
  const router = useRouter()
  const { id: budgetBoxId } = router.query
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { isLoading: isSwitchNetworkLoading, switchNetworkAsync } =
    useSwitchNetwork()

  const { loading, data: votesData } = useQuery(GET_VOTES, {
    variables: {
      data: { budgetBox: { id: budgetBoxId }, voter: address }
    },
    fetchPolicy: 'network-only'
  })

  const handleVote = (newVote: string) => {
    const nextVotes = votes.map((vote: string, index: number) => {
      if (index === pagination) {
        if (newVote === votes[index]) return ''
        return newVote
      }
      return vote
    })
    setVotes(nextVotes)
  }

  const signIn = async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) return
      if (chainId !== DEFAULT_NETWORK.chainId) {
        await switchNetworkAsync?.(DEFAULT_NETWORK.chainId)
      }
      setIsSignLoading(true)
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to Budget Boxes',
        uri: window.location.origin,
        version: '1',
        chainId: DEFAULT_NETWORK.chainId,
        nonce
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage()
      })
      const { data: verifyData } = await axios.post('/api/siwe/verify', {
        message,
        signature
      })
      setIsSignLoading(false)

      return verifyData?.ok
    } catch (e) {
      setIsSignLoading(false)
      setNonce(undefined)
      fetchNonce()

      return false
    }
  }

  const handleSubmit = async () => {
    const signSuccess = await signIn()
    if (signSuccess) {
      setIsVoteLoading(true)
      const finalVotes = votes.map((selection: string, index: number) => {
        return {
          alpha: pairs[index].alpha.id,
          beta: pairs[index].beta.id,
          preference: selection === 'alpha' ? 1 : selection === 'beta' ? -1 : 0
        }
      })

      const { data } = await axios.post('/api/vote/insert', {
        vote: {
          voter: address,
          preferences: finalVotes,
          budgetBox: {
            link: budgetBoxId
          }
        }
      })
      if (data?.message === 'Already voted') {
        setAlreadyVoted(true)
      }

      setIsVoteLoading(false)
      setVoted(true)
    }
    setIsVoteLoading(false)
  }

  const handleRedirect = (href: string) => {
    router.push(href)
  }

  const fetchNonce = async () => {
    const nonceRes = await axios.get('/api/siwe/nonce')
    setNonce(nonceRes?.data || '')
  }
  useEffect(() => {
    fetchNonce()
  }, [])

  useEffect(() => {
    setIsWrongNetwork(activeChain?.id !== DEFAULT_NETWORK.chainId)
  }, [activeChain])

  useEffect(() => {
    setIsConnected(!!address)
    setIsValidAddress(allowlist.includes(address as `0x${string}`))
  }, [address, allowlist])

  useEffect(() => {
    if (!!votesData) setAlreadyVoted(votesData?.votes.length > 0)
  }, [votesData])

  return (
    <div className="flex min-h-[calc(100vh_-_110px)] flex-col items-center justify-center">
      {loading ? (
        <div className="w-full px-4 text-center text-lg">
          <LoadingIcon label="loading" />
        </div>
      ) : pairs.length < 1 ? (
        <div className="w-full px-4 text-center text-lg">
          <span>There is no project in this budget box</span>
        </div>
      ) : !isConnected ? (
        <div className="w-full px-4 text-center text-lg">
          <span>Connect your wallet to be able to vote</span>
        </div>
      ) : isValidAddress && alreadyVoted === false ? (
        <>
          <div className="flex w-full items-center justify-center pt-10 lg:pt-28">
            <VotePair
              alpha={alpha}
              beta={beta}
              handleVote={handleVote}
              selected={votes[pagination]}
            />
          </div>
          <div className="mt-6 flex w-64 gap-x-4 py-2">
            <div
              className={classNames(
                'mt-2 h-[50px] w-full',
                pagination === 0 ? 'invisible' : ''
              )}
            >
              <PrimaryButton
                color={ButtonColors.GRAY}
                fontStyles="text-lg"
                label="Back"
                styles="py-2 px-4"
                onClick={() =>
                  setPagination((prevState) => Math.max(prevState - 1, 0))
                }
              />
            </div>
            <div
              className={classNames(
                'mt-2 h-[50px] w-full',
                pagination === pairs.length - 1 ? 'invisible' : ''
              )}
            >
              <PrimaryButton
                color={ButtonColors.LIGHT_BLUE}
                fontStyles="text-lg"
                label="Next"
                styles="py-2 px-4"
                onClick={() =>
                  setPagination((prevState) =>
                    Math.min(prevState + 1, pairs.length - 1)
                  )
                }
              />
            </div>
          </div>
          <div className="flex w-64 pb-10">
            {voted ? (
              <div
                className={classNames(
                  'mt-2 h-[60px] w-full',
                  pagination !== pairs.length - 1 ? 'invisible' : ''
                )}
              >
                <PrimaryButton
                  color={ButtonColors.LIGHT_BLUE}
                  fontStyles="text-lg"
                  label="See results"
                  styles="w-full"
                  onClick={() => handleRedirect(`/ranking/${budgetBoxId}`)}
                />
              </div>
            ) : (
              <div
                className={classNames(
                  'mt-2 h-[50px] w-full',
                  pagination !== pairs.length - 1 ? 'invisible' : ''
                )}
              >
                <PrimaryButton
                  color={ButtonColors.LIGHT_BLUE}
                  fontStyles="text-lg"
                  styles="w-full"
                  disabled={
                    isSignLoading || isVoteLoading || isSwitchNetworkLoading
                  }
                  label={
                    isSwitchNetworkLoading ? (
                      <LoadingIcon label="Waiting switch network" />
                    ) : isWrongNetwork ? (
                      <span>Switch network to vote</span>
                    ) : isSignLoading ? (
                      <LoadingIcon label="Waiting for signature" />
                    ) : isVoteLoading ? (
                      <LoadingIcon label="Submitting vote" />
                    ) : (
                      'Vote'
                    )
                  }
                  onClick={handleSubmit}
                />
              </div>
            )}
          </div>
        </>
      ) : alreadyVoted ? (
        <div className="h-full w-full px-4 text-center text-lg">
          <span>You have already voted on this budget box</span>
        </div>
      ) : (
        <div className="h-full w-full px-4 text-center text-lg">
          <span>You&apos;re not allowed to vote on this budget box</span>
        </div>
      )}
    </div>
  )
}

export default Vote

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'
import { SiweMessage } from 'siwe'
import classNames from 'classnames'
import axios from 'axios'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { trpc } from '@/utils/trpc'
import { VotePair } from '@/components/vote/VotePair'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { DEFAULT_NETWORK } from '@/constants/network'
import type { AppRouter } from '@/server/trpc/router/_app'
import type { GetServerSideProps } from 'next'
import type { inferRouterOutputs } from '@trpc/server'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  return {
    props: {
      budgetBoxId: params?.id
    }
  }
}

interface IVote {
  budgetBoxId: string
}
type RouterOutput = inferRouterOutputs<AppRouter>
type GetOneBudgetBoxOutput = RouterOutput['project']['getOne']

interface IVotePair {
  alpha: GetOneBudgetBoxOutput
  beta: GetOneBudgetBoxOutput
}

const Vote = ({ budgetBoxId }: IVote) => {
  const [voted, setVoted] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null)
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false)
  const [isSignLoading, setIsSignLoading] = useState<boolean>(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false)
  const [alreadyVoted, setAlreadyVoted] = useState<boolean | null>(null)
  const [nonce, setNonce] = useState<string | undefined>('')

  const [pagination, setPagination] = useState<number>(0)
  const [votes, setVotes] = useState<Array<string>>([])
  const [pairs, setPairs] = useState<Array<IVotePair>>([])
  const router = useRouter()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { isLoading: isSwitchNetworkLoading, switchNetworkAsync } =
    useSwitchNetwork()
  const { data: projects, isLoading } =
    trpc.project.getManyByBudgetBoxId.useQuery(
      {
        id: budgetBoxId
      },
      {
        refetchOnWindowFocus: false
      }
    )
  const { data: budgetBoxData } = trpc.budgetBox.getOne.useQuery(
    {
      id: budgetBoxId
    },
    {
      refetchOnWindowFocus: false
    }
  )
  const { data: previousVotes, refetch: refetchPreviousVotes } =
    trpc.vote.getManyByVoter.useQuery(
      {
        voter: address || ''
      },
      {
        refetchOnWindowFocus: false
      }
    )
  const insertOneVoteMutation = trpc.vote.insertOne.useMutation()

  const handleRedirect = (href: string) => {
    router.push(href)
  }

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
    if (signSuccess && address) {
      setIsVoteLoading(true)
      const preferences = votes.map((selection: string, index: number) => {
        return {
          alphaId: pairs[index]?.alpha?.id || '',
          betaId: pairs[index]?.beta?.id || '',
          preference: selection === 'alpha' ? 1 : selection === 'beta' ? -1 : 0
        }
      })
      const { data: previousVotes } = await refetchPreviousVotes()

      // only let first time voters to submit their votes
      if (Array.isArray(previousVotes) && previousVotes.length === 0) {
        insertOneVoteMutation.mutate({
          voter: address || '',
          budgetBoxId,
          preferences
        })
      } else {
        setAlreadyVoted(true)
      }

      setIsVoteLoading(false)
      setVoted(true)
    }
    setIsVoteLoading(false)
  }
  const fetchNonce = async () => {
    const nonceRes = await axios.get('/api/siwe/nonce')
    setNonce(nonceRes?.data || '')
  }

  useEffect(() => {
    fetchNonce()
  }, [])

  useEffect(() => {
    if (Array.isArray(previousVotes)) {
      setAlreadyVoted(previousVotes.length > 0)
    }
  }, [previousVotes])

  useEffect(() => {
    if (projects) {
      setPairs(
        projects
          ?.flatMap((a, i) =>
            projects.slice(i + 1).map((b) => {
              if (0.5 - Math.random() > 0) return { alpha: a, beta: b }
              return { alpha: b, beta: a }
            })
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 20) ?? []
      )
    }
  }, [projects])

  useEffect(() => {
    setIsConnected(!!address)
    if (address && budgetBoxData?.allowlist) {
      setIsValidAddress(
        budgetBoxData.allowlist.includes(address as `0x${string}`)
      )
    }
  }, [address, budgetBoxData])

  useEffect(() => {
    if (pairs) {
      setVotes(Array(pairs.length).fill(''))
    }
  }, [pairs])

  useEffect(() => {
    setIsWrongNetwork(activeChain?.id !== DEFAULT_NETWORK.chainId)
  }, [activeChain])

  if (isLoading)
    return (
      <main className="flex min-h-[calc(100vh_-_100px)] flex-col items-center justify-center">
        <div className="w-full px-4 text-center text-lg">
          <LoadingIcon label="loading" />
        </div>
      </main>
    )

  return (
    <main className="flex min-h-[calc(100vh_-_100px)] flex-col items-center justify-center">
      {pairs.length < 1 ? (
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
              alpha={pairs[pagination]?.alpha}
              beta={pairs[pagination]?.beta}
              handleVote={handleVote}
              selected={votes[pagination] || ''}
            />
          </div>
          <div className="mt-8 text-2xl font-semibold">
            {pagination + 1}/{pairs.length}
          </div>
          <div className="mt-2 flex w-64 gap-x-4 ">
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
          <div className="mb-10 mt-2 flex w-64">
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
    </main>
  )
}

export default Vote

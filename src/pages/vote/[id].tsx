import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { VotePair } from '@/components/vote/VotePair'
import { Project } from '@/types/project'
import { graphqlClient } from '@/graphql/clients/client'
import { GET_ALLOWLIST_AND_PROJECTS_FROM_BUDGET_BOX } from '@/graphql/queries/project'

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
      projects,
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

const Vote = ({ pairs, projects, allowlist }: IVote) => {
  const [pagination, setPagination] = useState<number>(0)
  const [votes, setVotes] = useState<Array<string>>(
    Array(pairs.length).fill('')
  )
  const [voted, setVoted] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false)
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false)
  const { alpha, beta } = pairs[pagination]
  const router = useRouter()
  const { id: budgetBoxId } = router.query
  const { address } = useAccount()

  const handleVote = (newVote: string) => {
    const nextVotes = votes.map((vote: string, index: number) => {
      if (index === pagination) return newVote
      return vote
    })
    setVotes(nextVotes)
  }

  const handleSubmit = async () => {
    setIsVoteLoading(true)
    const finalVotes = votes.map((selection: string, index: number) => {
      return {
        alpha: pairs[index].alpha.id,
        beta: pairs[index].beta.id,
        preference: selection === 'alpha' ? 1 : selection === 'beta' ? -1 : 0
      }
    })

    await axios.post('/api/vote/insert', {
      vote: {
        voter: address,
        preferences: finalVotes,
        budgetBox: {
          link: budgetBoxId
        }
      }
    })

    const projectIds = projects.map((project: Project) => project.id)
    await axios.post('/api/ranking', {
      projects: projectIds,
      votes: finalVotes
    })
    setIsVoteLoading(false)
    setVoted(true)
  }

  const handleRedirect = (href: string) => {
    router.push(href)
  }

  useEffect(() => {
    setIsConnected(!!address)
    setIsValidAddress(allowlist.includes(address as `0x${string}`))
  }, [address, allowlist])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      {isValidAddress ? (
        <>
          <div className="flex w-full items-center justify-center pt-36">
            <VotePair
              alpha={alpha}
              beta={beta}
              handleVote={handleVote}
              selected={votes[pagination]}
            />
          </div>
          <div className="mt-6 flex w-52 gap-x-4 py-2">
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
          <div className="flex w-52">
            {voted ? (
              <div
                className={classNames(
                  'mt-2 h-[50px] w-full',
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
                  disabled={isVoteLoading}
                  fontStyles="text-lg"
                  styles="w-full"
                  label={
                    isVoteLoading ? (
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
      ) : (
        <div className="h-full w-full px-4 text-center text-lg">
          {isConnected ? (
            <span>You&apos;re not allowed to vote on this budget box</span>
          ) : (
            <span>Connect your wallet to be able to vote</span>
          )}
        </div>
      )}
    </div>
  )
}

export default Vote

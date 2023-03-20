import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { trpc } from '@/utils/trpc'
import { useSiwe } from '@/hooks/useSiwe'
import { VotePair } from '@/components/vote/VotePair'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { VotingProgressDetails } from '@/components/details/VotingProgressDetails'
import { NextArrowIcon } from '@/components/icons'
import type { AppRouter } from '@/server/trpc/router/_app'
import { NavArrow } from '@/components/navigation/NavArrow'
import type { GetServerSideProps } from 'next'
import type { inferRouterOutputs } from '@trpc/server'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  return {
    props: {
      budgetBoxId: params?.budgetBoxId,
      spaceSlug: params?.spaceSlug
    }
  }
}

interface IVote {
  budgetBoxId: string
  spaceSlug: string
}
type RouterOutput = inferRouterOutputs<AppRouter>
type GetOneBudgetBoxOutput = RouterOutput['project']['getOne']

interface IVotePair {
  alpha: GetOneBudgetBoxOutput
  beta: GetOneBudgetBoxOutput
}

const Vote = ({ budgetBoxId, spaceSlug }: IVote) => {
  const [voted, setVoted] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null)
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false)
  const [alreadyVoted, setAlreadyVoted] = useState<boolean | null>(null)
  const [pagination, setPagination] = useState<number>(0)
  const [votes, setVotes] = useState<Array<string>>([])
  const [pairs, setPairs] = useState<Array<IVotePair>>([])
  const router = useRouter()
  const {
    address,
    isSignLoading,
    isSwitchNetworkLoading,
    isWrongNetwork,
    signIn
  } = useSiwe()

  const currentDate = new Date()
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })
  const { data: projects, isLoading: isLoadingProjects } =
    trpc.project.getManyByBudgetBoxId.useQuery(
      {
        id: budgetBoxId
      },
      {
        refetchOnWindowFocus: false
      }
    )
  const { data: budgetBoxData, isLoading: isLoadingBudgetBox } =
    trpc.budgetBox.getOne.useQuery(
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

  const { data: scores } = trpc.snapshot.getScores.useQuery({
    voters: [address || ''],
    strategies: budgetBoxData
      ? budgetBoxData.Strategies.map(({ name, network, params }) => ({
          name,
          network,
          params
        }))
      : []
  })

  const insertOneVoteMutation = trpc.vote.insertOne.useMutation()

  const handleRedirect = (href: string) => {
    router.push(href)
  }

  const handleVote = (newVote: string) => {
    setPagination((prevState) => Math.min(prevState + 1, pairs.length - 1))
    const nextVotes = votes.map((vote: string, index: number) => {
      if (index === pagination) {
        if (newVote === votes[index]) return ''
        return newVote
      }
      return vote
    })
    setVotes(nextVotes)
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

      if (
        (budgetBoxData && budgetBoxData.maxVotesPerUser === null) ||
        (Array.isArray(previousVotes) &&
          budgetBoxData &&
          budgetBoxData.maxVotesPerUser !== null &&
          previousVotes.length < budgetBoxData.maxVotesPerUser)
      ) {
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

  useEffect(() => {
    if (Array.isArray(previousVotes) && budgetBoxData) {
      const maxVotesPerUser = budgetBoxData.maxVotesPerUser
      if (maxVotesPerUser) {
        setAlreadyVoted(previousVotes.length >= maxVotesPerUser)
      } else {
        setAlreadyVoted(false)
      }
    }
  }, [previousVotes, budgetBoxData])

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
          .slice(
            0,
            budgetBoxData?.maxPairsPerVote
              ? budgetBoxData?.maxPairsPerVote
              : projects.length
          ) ?? []
      )
    }
  }, [projects, budgetBoxData])

  useEffect(() => {
    setIsConnected(!!address)
    if (address && scores) {
      const finalScore = scores.scoresByVoter[address] || 0
      setIsValidAddress(finalScore > 0)
    } else {
      setIsValidAddress(false)
    }
  }, [address, budgetBoxData, scores])

  useEffect(() => {
    if (pairs) {
      setVotes(Array(pairs.length).fill(''))
    }
  }, [pairs])

  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title, path: `/${spaceSlug}` },
    { name: budgetBoxData?.title, path: `/${spaceSlug}/${budgetBoxId}` },
    { name: 'Vote', path: `/${spaceSlug}/${budgetBoxId}/vote` }
  ]

  if (
    isLoadingProjects ||
    isLoadingBudgetBox ||
    isValidAddress === null ||
    (isConnected && alreadyVoted === null)
  )
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full px-4 text-center text-lg">
          <LoadingIcon label="loading" />
        </div>
      </main>
    )

  if (!budgetBoxData) return <main>No Pairwise found</main>

  return (
    <>
      <Head>
        <title>Vote</title>
      </Head>
      <NavArrow items={navArrowItems} />
      <main className="mx-auto flex max-w-[1100px] flex-col items-center justify-center">
        {budgetBoxData.startDate > currentDate ? (
          <div className="grid h-[500px] w-full place-content-center px-4 text-xl">
            <p>
              This Pairwise is not open to vote yet, it will be available
              between {budgetBoxData.startDate.toDateString()} and{' '}
              {budgetBoxData.endDate?.toDateString()}
            </p>
          </div>
        ) : budgetBoxData.endDate && budgetBoxData.endDate < currentDate ? (
          <div className="grid h-[500px] w-full place-content-center px-4 text-xl">
            <p>
              This Pairwise is already closed, it has been available between{' '}
              {budgetBoxData.startDate.toDateString()} and{' '}
              {budgetBoxData.endDate.toDateString()}
            </p>
          </div>
        ) : projects && projects.length < 2 ? (
          <div className="grid h-[500px] w-full place-content-center px-4 text-xl">
            <p>There is no project in this Pairwise</p>
          </div>
        ) : !isConnected ? (
          <div className="grid h-[500px] w-full place-content-center px-4 text-xl">
            <p>Connect your wallet to be able to vote</p>
          </div>
        ) : isValidAddress && alreadyVoted === false ? (
          <>
            <VotingProgressDetails
              currentProject={pagination + 1}
              maxProjects={pairs.length}
            />
            <div className="flex w-full items-center justify-center pt-8 lg:pt-12">
              <NextArrowIcon
                className={classNames(
                  'rotate-180',
                  pagination === 0 ? 'opacity-50' : ''
                )}
                onClick={() =>
                  setPagination((prevState) => Math.max(prevState - 1, 0))
                }
              />
              <VotePair
                alpha={pairs[pagination]?.alpha}
                beta={pairs[pagination]?.beta}
                handleVote={handleVote}
                page={pagination}
                selected={votes[pagination] || ''}
              />
              <NextArrowIcon
                className={pagination === pairs.length - 1 ? 'opacity-50' : ''}
                onClick={() =>
                  setPagination((prevState) =>
                    Math.min(prevState + 1, pairs.length - 1)
                  )
                }
              />
            </div>
            <div className="mt-8 flex h-[60px] gap-x-8">
              <div className="w-44">
                <PrimaryButton
                  color={ButtonColors.BLUE_GRADIENT}
                  fontStyles="text-lg font-normal"
                  label="Abstain"
                  onClick={() => handleVote('')}
                />
              </div>
              <div className="w-44">
                {voted ? (
                  <PrimaryButton
                    color={ButtonColors.BLUE_GRADIENT}
                    fontStyles="text-lg font-normal"
                    label="See results"
                    onClick={() => handleRedirect(`/ranking/${budgetBoxId}`)}
                  />
                ) : (
                  <PrimaryButton
                    color={ButtonColors.BLUE_GRADIENT}
                    fontStyles="text-lg font-normal"
                    disabled={
                      isSignLoading ||
                      isVoteLoading ||
                      isSwitchNetworkLoading ||
                      (!!budgetBoxData.maxPairsPerVote &&
                        pagination !== pairs.length - 1)
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
                        'Submit Vote'
                      )
                    }
                    onClick={handleSubmit}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="grid h-[500px] w-full place-content-center px-4 text-xl">
            {alreadyVoted
              ? 'You have already voted on this budget box'
              : `You're not allowed to vote on this budget box`}
          </div>
        )}
      </main>
    </>
  )
}

export default Vote

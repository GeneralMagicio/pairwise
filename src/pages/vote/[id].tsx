import { GetServerSideProps } from 'next'
import { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { VotePair } from '@/components/vote/VotePair'
import { Project } from '@/types/project'
import { graphqlClient } from '@/graphql/clients/client'
import { GET_PROJECTS_FROM_BUDGET_BOX } from '@/graphql/queries/project'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const budgetBoxId = params?.id

  const { data } = await graphqlClient.query({
    query: GET_PROJECTS_FROM_BUDGET_BOX,
    variables: {
      data: { id: budgetBoxId }
    },
    fetchPolicy: 'network-only'
  })

  const projects: Array<Project> = data?.budgetBox?.projects

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
      projects
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
}

const Vote = ({ pairs, projects }: IVote) => {
  const [pagination, setPagination] = useState<number>(0)
  const [votes, setVotes] = useState<Array<string>>(
    Array(pairs.length).fill('')
  )
  const [voted, setVoted] = useState<boolean>(false)
  const { alpha, beta } = pairs[pagination]
  const router = useRouter()
  const { id: budgetBoxId } = router.query

  const handleVote = (newVote: string) => {
    const nextVotes = votes.map((vote: string, index: number) => {
      if (index === pagination) return newVote
      return vote
    })
    setVotes(nextVotes)
  }

  const handleSubmit = async () => {
    const finalVotes = votes.map((selection: string, index: number) => {
      return {
        alpha: pairs[index].alpha.id,
        beta: pairs[index].beta.id,
        preference: selection === 'alpha' ? 1 : selection === 'beta' ? -1 : 0
      }
    })

    await axios.post('/api/vote/insert', {
      vote: {
        voter: '0x62Fa674C88351866aD3385c265613EC45FEd571d',
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
    setVoted(true)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col border items-center justify-center">
      <VotePair
        alpha={alpha}
        beta={beta}
        handleVote={handleVote}
        selected={votes[pagination]}
      />
      <div className="mt-6 py-2 w-44 flex gap-x-4">
        <div
          className={classNames(
            ' px-4 py-2 w-20 text-center rounded-lg text-lg bg-gray-400 text-white font-semibold cursor-pointer',
            pagination === 0 ? 'invisible' : ''
          )}
          onClick={() =>
            setPagination((prevState) => Math.max(prevState - 1, 0))
          }
        >
          Back
        </div>

        <div
          className={classNames(
            'px-4 py-2 w-20 text-center rounded-lg text-lg bg-blue-500 text-white font-semibold cursor-pointer',
            pagination === pairs.length - 1 ? 'invisible' : ''
          )}
          onClick={() =>
            setPagination((prevState) =>
              Math.min(prevState + 1, pairs.length - 1)
            )
          }
        >
          Next
        </div>
      </div>
      {voted ? (
        <Link href={`/ranking/${budgetBoxId}`}>
          <div
            className={classNames(
              'mt-2 px-8 py-4 text-center rounded-lg text-xl bg-blue-500 text-white font-semibold cursor-pointer',
              pagination !== pairs.length - 1 ? 'invisible' : ''
            )}
          >
            See results
          </div>
        </Link>
      ) : (
        <div
          className={classNames(
            'mt-2 px-8 py-4 text-center rounded-lg text-xl bg-blue-500 text-white font-semibold cursor-pointer',
            pagination !== pairs.length - 1 ? 'invisible' : ''
          )}
          onClick={handleSubmit}
        >
          Vote
        </div>
      )}
    </div>
  )
}

export default Vote

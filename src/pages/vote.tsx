import { GetStaticProps } from 'next'
import { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import { VotePair } from '@/components/vote/VotePair'
import { Project } from '@/types/project'

export const getStaticProps: GetStaticProps = async () => {
  const projects: Array<Project> = [
    {
      id: 'a',
      title: 'Bridging Digital Communities',
      url: 'https://giveth.io/project/bridging-digital-communities',
      owner: 'Kay @geleeroyale',
      description:
        'I run a bridge server for chats (Discord, Telegram, Riot, ...) and am actively engaging communities connected to the Ethereum space. Especially with the advent of newDAOs my services are being requested on a regular basis. Most requested at the moment is bridging between community servers on Discord (both communities get to share a room), whereas before it was mostly mirroring rooms between different protocols. Once a bridge is up, it still needs to be maintained and I regularly check that everything is in working order.',
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmNbtiT1JRENpxBbQqQ39Dgzp3NteQeKpXGE9QijpPpM7K&w=1920&q=75'
    },
    {
      id: 'b',
      title: 'Diamante Bridge Collective',
      url: 'https://giveth.io/project/diamante-bridge-collective-0',
      owner: 'Diamante Bridge Collective',
      description: `The Diamante Bridge Collective (DBC) is a network of land stewards, individuals, organizations and communities located primarily within the Diamante Valley of Costa Rica, expanding to include those from the greater Southern Zone of Costa Rica, and those abroad.
The DBC functions as a hub of many physical nodes, connected via global networks of shared vision and mission with the goal of restoring, preserving and consciously stewarding surrounding lands and watersheds while living harmoniously within them in alignment with our planetary values.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmajCgweP9g2o4sGmrzioh3KHyBXTdY9rYmg31h2pzUsZb&w=1920&q=75'
    },
    {
      id: 'c',
      title: 'Unchain Fund',
      url: 'https://giveth.io/project/unchain-fund',
      owner: 'Alex Casas',
      description: `With your support we can quickly raise and distribute money to the people of Ukraine – to where they need it the most.
We are urgently raising funds for the support of the Ukrainian people - supporting effective NGO's doing work on the ground right now.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmTBRjvMzeZdo32Pp9EKhF2AQjZx2AcM53JNFqLwTW2ttf&w=1920&q=75'
    },
    {
      id: 'd',
      title: 'Diamante Luz Center for Regenerative Living',
      url: 'https://giveth.io/project/Diamante-Luz-Center-for-Regenerative-Living-0',
      owner: 'Diamante Luz',
      description: `Diamante Luz is a space for integrated collaboration and cooperation with nature. Our residents, neighbors, and visitors have been drawn to the area in order to co-create a space for living and working in balance with all of our relations.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmXoqPYCRgu8ZJuVXPpLnGN9dvh3TGtBxRVCwjCBCHiG4u&w=1920&q=75'
    }
  ]

  const projectsCombination = projects
    .flatMap((a, i) =>
      projects.slice(i + 1).map((b) => {
        if (0.5 - Math.random() > 0) return { alpha: a, beta: b }
        return { alpha: b, beta: a }
      })
    )
    .sort(() => 0.5 - Math.random())

  console.log(projectsCombination)

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
  const [votes, setVotes] = useState(Array(pairs.length).fill(''))
  const { alpha, beta } = pairs[pagination]

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
        preference: selection === 'alpha' ? 1 : 0
      }
    })
    const projectIds = projects.map((project: Project) => project.id)

    const response = await axios.post('/api/ranking', {
      projects: projectIds,
      votes: finalVotes
    })
    const { data, status } = response
    if (status === 200) {
      console.log(data)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col border items-center justify-center">
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
      <div
        className={classNames(
          'mt-2 px-8 py-4 w-30 text-center rounded-lg text-xl bg-blue-500 text-white font-semibold cursor-pointer',
          pagination !== pairs.length - 1 ? 'invisible' : ''
        )}
        onClick={handleSubmit}
      >
        Vote
      </div>
    </div>
  )
}

export default Vote

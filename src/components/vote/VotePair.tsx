import { VoteCard } from '@/components/cards/VoteCard'
import { ProjectCard } from '@/components/cards/ProjectCard'
import type { AppRouter } from '@/server/trpc/router/_app'
import type { FC } from 'react'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type Project = RouterOutput['project']['getOne']

interface IVotePair {
  alpha: Project | undefined
  beta: Project | undefined
  selected: string
  handleVote: (newVote: string) => void
}

export const VotePair: FC<IVotePair> = ({
  alpha,
  beta,
  selected,
  handleVote
}) => {
  return (
    <div className="flex w-full max-w-[1000px] cursor-pointer flex-col items-center justify-between gap-y-4 px-4 lg:flex-row lg:px-10">
      {alpha && beta && (
        <>
          <div onClick={() => handleVote('alpha')}>
            <VoteCard isSelected={selected === 'alpha'}>
              <ProjectCard
                description={alpha.description}
                image={alpha.image}
                owner={alpha.owner}
                title={alpha.title}
                url={alpha.url}
              />
            </VoteCard>
          </div>
          <div onClick={() => handleVote('beta')}>
            <VoteCard isSelected={selected === 'beta'}>
              <ProjectCard
                description={beta.description}
                image={beta.image}
                owner={beta.owner}
                title={beta.title}
                url={beta.url}
              />
            </VoteCard>
          </div>
        </>
      )}
    </div>
  )
}

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
  page: number
}

export const VotePair: FC<IVotePair> = ({
  alpha,
  beta,
  selected,
  handleVote,
  page
}) => {
  return (
    <div className="flex w-full max-w-[920px] flex-col items-center justify-between gap-y-4 px-4 lg:flex-row lg:px-10">
      {alpha && beta && (
        <>
          <div onClick={() => handleVote('alpha')}>
            <ProjectCard
              description={alpha.description as string}
              image={alpha.image as string}
              isSelected={selected === 'alpha'}
              owner={alpha.owner as string}
              page={page}
              title={alpha.title as string}
              url={alpha.url as string}
            />
          </div>
          <div onClick={() => handleVote('beta')}>
            <ProjectCard
              description={beta.description as string}
              image={beta.image as string}
              isSelected={selected === 'beta'}
              owner={beta.owner as string}
              page={page}
              title={beta.title as string}
              url={beta.url as string}
            />
          </div>
        </>
      )}
    </div>
  )
}

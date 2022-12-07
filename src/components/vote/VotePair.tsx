import { VoteCard } from '@/components/cards/VoteCard'
import { ProjectCard } from '@/components/cards/ProjectCard'
import type { FC } from 'react'

interface IProjectCard {
  title: string
  url?: string
  owner?: string
  description?: string
  image?: string
}

interface IVotePair {
  alpha: IProjectCard | null | undefined
  beta: IProjectCard | null | undefined
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

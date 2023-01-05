import { ProjectRankingCard } from '@/components/cards/ProjectRankingCard'
import type { AppRouter } from '@/server/trpc/router/_app'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type projects = RouterOutput['budgetBox']['getRanking']

interface IRankingCard {
  projects: projects
}

export const RankingCard = ({ projects }: IRankingCard) => {
  return (
    <div className="mx-auto w-full rounded-lg bg-gray-50 p-8 shadow-xl">
      {projects.length > 0 ? (
        <>
          <h2 className="mb-4 text-2xl font-bold">Current Results</h2>
          <div className="grid gap-y-3">
            {projects.map((project) => (
              <ProjectRankingCard
                key={project.id}
                description={project.description as string}
                image={project.image as string}
                owner={project.owner as string}
                power={project.power}
                title={project.title as string}
                url={project.url as string}
              />
            ))}
          </div>
        </>
      ) : (
        <h2 className="my-4 text-2xl font-bold">No Ranking Found</h2>
      )}
    </div>
  )

  // projects ? (

  // ) : (
  //   <div>No project found</div>
}

import Link from 'next/link'
import { BudgetBoxInfoCard } from '@/components/cards/BudgetBoxInfoCard'
import { TickIcon } from '@/components/icons'
import { ProjectVotesBar } from '@/components/charts/ProjectVotesBar'

interface ITopProject {
  power: number
  title: string
}

interface IBudgetBoxInfoLiveCard {
  budgetBoxId: string
  projectsCount: number
  spaceSlug: string
  title: string
  topProjects?: Array<ITopProject>
}

export const BudgetBoxInfoLiveCard = ({
  budgetBoxId,
  projectsCount,
  spaceSlug,
  title,
  topProjects
}: IBudgetBoxInfoLiveCard) => {
  const maxPercentage =
    topProjects && topProjects?.length > 0 && topProjects[0]
      ? Math.min(100 * topProjects[0].power, 100)
      : 100
  return (
    <BudgetBoxInfoCard className="flex flex-col justify-between" title={title}>
      {projectsCount > 0 ? (
        <>
          <div className="mt-2 flex items-center">
            <TickIcon height={18} width={18} />
            <p className="ml-4 text-gray-500">{projectsCount} Projects</p>
          </div>
          <Link href={`/${spaceSlug}/${budgetBoxId}/projects`}>
            <h4 className="mt-2 text-center text-gray-600 transition duration-200 hover:font-medium hover:text-gray-800">
              See all projects
            </h4>
          </Link>
          <div className="my-2 font-semibold">Top Projects</div>
          {topProjects
            ? topProjects.map((project) => (
                <div key={project.title} className="flex flex-col gap-y-2">
                  <ProjectVotesBar
                    maxPercentage={maxPercentage}
                    projectPercentage={project.power * 100}
                    title={project.title}
                  />
                </div>
              ))
            : null}
        </>
      ) : (
        <div className="flex h-full items-center">
          <h2 className="px-4 text-center font-semibold">
            There is no project in this Pairwise
          </h2>
        </div>
      )}
    </BudgetBoxInfoCard>
  )
}

import { BarChart } from '@/components/charts/BarChart'

interface IVotingProgressDetails {
  currentProject: number
  maxProjects: number
}

export const VotingProgressDetails = ({
  currentProject,
  maxProjects
}: IVotingProgressDetails) => {
  return (
    <div className="mt-2 w-full">
      <div className="mb-4 text-2xl font-bold text-blue-900">
        Voting Progress
      </div>
      <div className="px-8 text-sm text-gray-500">
        <div className="mb-1">
          {Math.floor((100 * currentProject) / maxProjects)}%
        </div>
        <BarChart
          height={8}
          maxPercentage={maxProjects}
          percentage={currentProject}
        />
        <div className="mt-2">{`${currentProject}/${maxProjects}`}</div>
      </div>
    </div>
  )
}

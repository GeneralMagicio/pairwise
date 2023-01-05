import { BarChart } from '@/components/charts/BarChart'

interface IProjectVotesBar {
  maxPercentage: number
  projectPercentage: number
  title: string
}

export const ProjectVotesBar = ({
  maxPercentage,
  projectPercentage,
  title
}: IProjectVotesBar) => {
  return (
    <>
      <p className="flex h-6 justify-between pt-1 text-sm text-gray-500">
        {title}
        <span className="self-end">{`${projectPercentage.toFixed(1)}%`}</span>
      </p>
      <BarChart
        height={6}
        maxPercentage={maxPercentage}
        percentage={projectPercentage}
      />
    </>
  )
}

import { BarChart } from '@/components/charts/BarChart'
import type { FC } from 'react'

interface IProjectVotesBar {
  maxPercentage: number
  projectPercentage: number
  title: string
}

export const ProjectVotesBar: FC<IProjectVotesBar> = ({
  maxPercentage,
  projectPercentage,
  title
}) => {
  return (
    <>
      <div className="flex h-6 justify-between pt-1 text-sm text-gray-500">
        <span>{title}</span>
        <span className="self-end">{`${projectPercentage.toFixed(1)}%`}</span>
      </div>
      <BarChart
        height={6}
        maxPercentage={maxPercentage}
        percentage={projectPercentage}
      />
    </>
  )
}

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
      <div className="h-2 w-full overflow-hidden rounded-md bg-gray-200">
        <div
          className="h-2 bg-gradient-to-b from-cyan-600 to-cyan-500"
          style={{ width: `${(100 * projectPercentage) / maxPercentage}%` }}
        ></div>
      </div>
    </>
  )
}

import classNames from 'classnames'

classNames

interface IBarChart {
  height?: number
  percentage: number
  maxPercentage?: number
}

export const BarChart = ({
  height = 2,
  percentage,
  maxPercentage = 100
}: IBarChart) => {
  return (
    <div
      className="w-full overflow-hidden  rounded-md bg-gray-200"
      style={{ height: height }}
    >
      <div
        className="bg-gradient-to-b from-cyan-600 to-cyan-500"
        style={{
          width: `${(100 * percentage) / maxPercentage}%`,
          height: height
        }}
      ></div>
    </div>
  )
}

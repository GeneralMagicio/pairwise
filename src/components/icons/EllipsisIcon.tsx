import type { IconProps } from '.'

export const EllipsisIcon = ({
  color = '#4B5563',
  height = 19,
  width = 4
}: IconProps) => (
  <svg
    fill="none"
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2.5v.01M2 9.5v.01m0 6.99v.01M2 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

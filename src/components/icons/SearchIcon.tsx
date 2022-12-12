import type { IconProps } from '.'
import type { FC } from 'react'

export const SearchIcon: FC<IconProps> = ({
  color = '#FFFFFF',
  height = 24,
  width = 24
}) => (
  <svg
    fill="FFFFFF"
    height={height}
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M9.007 3.002a6.005 6.005 0 1 0 0 12.01 6.005 6.005 0 0 0 0-12.01ZM0 9.007a9.006 9.006 0 1 1 16.348 5.217l7.23 7.231a1.5 1.5 0 0 1-2.122 2.123l-7.23-7.23A9.006 9.006 0 0 1 0 9.007Z"
      fill={color}
      fill-rule="evenodd"
    />
  </svg>
)

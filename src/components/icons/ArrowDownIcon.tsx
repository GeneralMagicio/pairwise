import type { IconProps } from '.'
import type { FC } from 'react'

export const ArrowDownIcon: FC<IconProps> = ({
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
      d="M1.643 5.66c.412-.405.971-.633 1.554-.633.583 0 1.141.228 1.553.633l7.236 7.12 7.236-7.12A2.199 2.199 0 0 1 20.784 5a2.228 2.228 0 0 1 1.572.633 2.13 2.13 0 0 1 .465 2.382 2.163 2.163 0 0 1-.492.703l-8.79 8.649c-.411.405-.97.633-1.553.633a2.216 2.216 0 0 1-1.553-.633l-8.79-8.65A2.145 2.145 0 0 1 1 7.19c0-.573.231-1.123.643-1.529Z"
      fill={color}
      fill-rule="evenodd"
    />
  </svg>
)

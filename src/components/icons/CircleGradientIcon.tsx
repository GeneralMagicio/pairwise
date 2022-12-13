import type { IconProps } from '.'
import type { FC } from 'react'

export const CircleGradientIcon: FC<IconProps> = ({
  height = 24,
  width = 24
}) => (
  <svg
    fill="none"
    height={height}
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      height="21"
      rx="10.5"
      stroke="url(#a)"
      stroke-width="3"
      width="21"
      x="1.5"
      y="1.5"
    />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="a"
        x1="12"
        x2="12"
        y1="0"
        y2="24"
      >
        <stop stop-color="#2E86BE" />
        <stop offset="1" stop-color="#25A9A8" />
      </linearGradient>
    </defs>
  </svg>
)

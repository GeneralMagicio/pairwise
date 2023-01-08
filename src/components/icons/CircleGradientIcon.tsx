import type { IconProps } from '.'

export const CircleGradientIcon = ({ height = 24, width = 24 }: IconProps) => (
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
      strokeWidth="3"
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
        <stop stopColor="#2E86BE" />
        <stop offset="1" stopColor="#25A9A8" />
      </linearGradient>
    </defs>
  </svg>
)

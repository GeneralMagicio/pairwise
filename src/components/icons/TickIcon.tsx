import type { IconProps } from '.'

export const TickIcon = ({
  color = '#FFFFFF',
  height = 24,
  width = 24
}: IconProps) => (
  <svg
    fill={color}
    height={height}
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#fff" height="24" rx="12" width="24" />
    <path
      clip-rule="evenodd"
      d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24Zm5.56-13.94a1.5 1.5 0 0 0-2.12-2.12l-4.94 4.939-1.94-1.94a1.5 1.5 0 0 0-2.12 2.121l3 3a1.5 1.5 0 0 0 2.12 0l6-6Z"
      fill="url(#a)"
      fill-rule="evenodd"
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
        <stop stop-color="#2D89BC" />
        <stop offset="1" stop-color="#25A9A8" />
      </linearGradient>
    </defs>
  </svg>
)

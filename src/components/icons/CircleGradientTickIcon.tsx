import type { IconProps } from '.'

export const CircleGradientTickIcon = ({
  height = 24,
  width = 24
}: IconProps) => (
  <svg
    fill="none"
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#DFF9EE" height="29" rx="14.5" width="29" x="1.5" y="1.5" />
    <path
      clipRule="evenodd"
      d="M23.747 10.563a1.155 1.155 0 0 1 0 1.634l-9.24 9.24a1.155 1.155 0 0 1-1.634 0l-4.62-4.62a1.155 1.155 0 0 1 1.634-1.634l3.803 3.804 8.423-8.424a1.155 1.155 0 0 1 1.634 0Z"
      fill="#1A56DB"
      fillRule="evenodd"
    />
    <rect
      height="29"
      rx="14.5"
      stroke="url(#a)"
      strokeWidth="3"
      width="29"
      x="1.5"
      y="1.5"
    />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="a"
        x1="16"
        x2="16"
        y1="0"
        y2="32"
      >
        <stop stopColor="#2E85BF" />
        <stop offset="1" stopColor="#25A9A8" />
      </linearGradient>
    </defs>
  </svg>
)

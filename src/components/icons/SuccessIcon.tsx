import type { IconProps } from '.'

export const SuccessIcon = ({
  color = '#DEF7EC',
  height = 42,
  width = 42
}: IconProps) => (
  <svg
    fill="none"
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill={color} height={height} rx={width / 2} width={width} />
    <path
      clipRule="evenodd"
      d="M35.085 11.115a2.1 2.1 0 0 1 0 2.97l-16.8 16.8a2.1 2.1 0 0 1-2.97 0l-8.4-8.4a2.1 2.1 0 0 1 2.97-2.97l6.915 6.916 15.315-15.316a2.1 2.1 0 0 1 2.97 0Z"
      fill="#0E9F6E"
      fillRule="evenodd"
    />
  </svg>
)

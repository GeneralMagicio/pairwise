import type { IconProps } from '.'

export const NextArrowIcon = ({
  className = '',
  color = '#1F2A37',
  height = 40,
  onClick = () => null,
  width = 40
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <rect fill={color} height={height} rx="20" width={width} />
    <path d="M17.5 14.167 23.333 20 17.5 25.833" stroke="#fff" />
  </svg>
)

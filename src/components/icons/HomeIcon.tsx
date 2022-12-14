import type { IconProps } from '.'

export const HomeIcon = ({
  color = '#FFFFFF',
  height = 24,
  width = 24
}: IconProps) => (
  <svg
    fill="FFFFFF"
    height={height}
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.062.44a1.503 1.503 0 0 0-2.124 0L.422 10.94a1.499 1.499 0 0 0 1.067 2.541c.394.004.774-.147 1.057-.42l.44-.44V22.5A1.5 1.5 0 0 0 4.488 24h3.005a1.503 1.503 0 0 0 1.502-1.5v-3a1.499 1.499 0 0 1 1.503-1.5h3.004a1.504 1.504 0 0 1 1.503 1.5v3a1.5 1.5 0 0 0 1.502 1.5h3.005a1.503 1.503 0 0 0 1.502-1.5v-9.88l.44.44A1.504 1.504 0 0 0 24 11.994a1.499 1.499 0 0 0-.422-1.055L13.062.44Z"
      fill={color}
    />
  </svg>
)

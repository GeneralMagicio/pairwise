import type { IconProps } from '.'

export const CloseIcon = ({
  color = '#9CA3AF',
  height = 14,
  width = 14
}: IconProps) => (
  <svg
    fill="none"
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M.341.356a1.165 1.165 0 0 1 1.648 0l5.004 5.009L11.996.356a1.165 1.165 0 1 1 1.648 1.65L8.641 7.014l5.003 5.009a1.167 1.167 0 0 1-1.648 1.65L6.993 8.663l-5.004 5.008a1.165 1.165 0 0 1-1.648-1.65l5.004-5.008L.34 2.006a1.167 1.167 0 0 1 0-1.65Z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
)

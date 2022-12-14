import className from 'classnames'
import type { ReactElement } from 'react'

export enum ButtonColors {
  BLACK = 'black',
  BLUE = 'blue',
  LIGHT_BLUE = 'light-blue',
  GRAY = 'gray',
  WHITE = 'white',
  PURPLE = 'purple',
  RED = 'red',
  BLUE_GRADIENT = 'blue-gradient'
}

const colors: { [key in ButtonColors]: string } = {
  black: 'bg-black hover:bg-black/90 disabled:bg-black/70',
  blue: 'bg-blue hover:bg-blue/90 disabled:bg-blue/70',
  'light-blue': 'bg-blue-500 hover:bg-blue-500/90 disabled:bg-blue-500/70',
  gray: 'bg-gray-400 hover:bg-gray-400/90 disabled:bg-gray-400/70',
  white: 'bg-white hover:bg-white/90 disabled:bg-gray-200',
  purple: 'bg-purple hover:bg-purple/90 disabled:bg-purple/70',
  red: 'bg-red hover:bg-red/90 disabled:bg-red/70',
  'blue-gradient':
    'bg-gradient-to-b from-blue-500 to-cyan-300 hover:from-blue-500/90 hover:to-cyan-300/90 disabled:from-blue-500/70 disabled:to-cyan-300/70'
}

const textColor: { [key in ButtonColors]: string } = {
  black: 'text-white',
  blue: 'text-white',
  'light-blue': 'text-white',
  gray: 'text-white',
  white: 'text-black',
  purple: 'text-white',
  red: 'text-white',
  'blue-gradient': 'text-white'
}

interface IPrimaryButton {
  border?: boolean
  color: ButtonColors
  disabled?: boolean
  label: string | ReactElement
  onClick?: () => void
  reverse?: boolean
  styles?: string
  fontStyles?: string
  type?: 'button' | 'submit' | 'reset' | undefined
}

export const PrimaryButton = ({
  border,
  color,
  disabled,
  label,
  onClick,
  styles,
  fontStyles,
  type = 'button'
}: IPrimaryButton) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={className(
        'h-full w-full min-w-fit rounded-lg px-6',
        colors[color],
        border && 'border border-black',
        styles
      )}
      onClick={onClick}
    >
      <span
        className={className(
          'font-bai font-bold',
          textColor[color],
          fontStyles
        )}
      >
        {label}
      </span>
    </button>
  )
}

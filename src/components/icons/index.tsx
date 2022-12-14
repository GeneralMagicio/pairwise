import { ArrowDownIcon } from './ArrowDownIcon'
import { CircleGradientIcon } from './CircleGradientIcon'
import { CircleGradientTickIcon } from './CircleGradientTickIcon'
import { CreateIcon } from './CreateIcon'
import { HomeIcon } from './HomeIcon'
import { NextArrowIcon } from './NextArrowIcon'
import { SearchIcon } from './SearchIcon'
import { TickIcon } from './TickIcon'

export interface IconProps {
  className?: string
  color?: string
  height?: number
  onClick?: () => void
  width?: number
}

export {
  ArrowDownIcon,
  CircleGradientIcon,
  CircleGradientTickIcon,
  CreateIcon,
  HomeIcon,
  NextArrowIcon,
  SearchIcon,
  TickIcon
}

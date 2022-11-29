import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

interface IVoteCard {
  children: ReactNode
  isSelected: boolean
}

export const VoteCard: FC<IVoteCard> = ({ children, isSelected }) => {
  return (
    <div
      className={classNames(
        'rounded-2xl border p-4 shadow-lg duration-100 hover:scale-102',
        isSelected ? 'scale-102 bg-green-300' : 'bg-gray-200'
      )}
    >
      {children}
    </div>
  )
}

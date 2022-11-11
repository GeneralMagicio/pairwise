import { FC, ReactNode } from 'react'
import classNames from 'classnames'

interface IVoteCard {
  children: ReactNode
  isSelected: boolean
}

export const VoteCard: FC<IVoteCard> = ({ children, isSelected }) => {
  return (
    <div
      className={classNames(
        'p-6 rounded-2xl border shadow-lg hover:scale-102 duration-100',
        isSelected ? 'bg-green-300 scale-102' : 'bg-gray-200'
      )}
    >
      {children}
    </div>
  )
}

import { FC, ReactNode } from 'react'
import classNames from 'classnames'

interface IVoteCard {
  children: ReactNode
  isSelected: boolean
}

export const VoteCard: FC<IVoteCard> = ({
  children,
  isSelected
}: IVoteCard) => {
  return (
    <div
      className={classNames(
        'p-6 rounded-2xl border shadow-lg hover:scale-105 duration-100',
        isSelected ? 'bg-green-300 scale-105' : 'bg-gray-200'
      )}
    >
      {children}
    </div>
  )
}

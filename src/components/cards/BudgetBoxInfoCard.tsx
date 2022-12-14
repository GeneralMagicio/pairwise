import classNames from 'classnames'
import type { ReactElement } from 'react'

interface IBudgetBoxInfoCard {
  children: ReactElement
  className?: string
  title: string
}

export const BudgetBoxInfoCard = ({
  children,
  className,
  title
}: IBudgetBoxInfoCard) => {
  return (
    <div
      className={classNames(
        'h-[280px] w-[330px] rounded-lg bg-gray-50 px-8 py-6 shadow-md',
        className
      )}
    >
      <div className="text-lg font-bold text-black">{title}</div>
      {children}
    </div>
  )
}

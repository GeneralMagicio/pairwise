import { BudgetBoxInfoCard } from './BudgetBoxInfoCard'
import moment from 'moment'
import type { FC } from 'react'

interface IBudgetBoxInfoVotingCard {
  allowanceMethod: string
  endDate: Date
  startDate: Date
  title: string
}

export const BudgetBoxInfoVotingCard: FC<IBudgetBoxInfoVotingCard> = ({
  allowanceMethod,
  endDate,
  startDate,
  title
}) => {
  return (
    <BudgetBoxInfoCard className="h-[195px]" title={title}>
      <>
        <div className="mt-4 flex w-full justify-between text-gray-500">
          <span>Start Date</span>
          <span>{moment(startDate).format('MMM DD YYYY')}</span>
        </div>
        <div className="mt-4 flex w-full justify-between text-gray-500">
          <span>End Date</span>
          <span>{moment(endDate).format('MMM DD YYYY')}</span>
        </div>
        <div className="mt-4 flex w-full justify-between text-gray-500">
          <span>Allowance Method</span>
          <span>{allowanceMethod}</span>
        </div>
      </>
    </BudgetBoxInfoCard>
  )
}

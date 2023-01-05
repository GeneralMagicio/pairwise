import { BudgetBoxInfoCard } from './BudgetBoxInfoCard'
import moment from 'moment'

interface IBudgetBoxInfoVotingCard {
  allowanceMethod: string
  endDate: Date | null
  startDate: Date
  title: string
}

export const BudgetBoxInfoVotingCard = ({
  allowanceMethod,
  endDate,
  startDate,
  title
}: IBudgetBoxInfoVotingCard) => {
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

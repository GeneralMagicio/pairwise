import moment from 'moment'
import { useState } from 'react'
import { StrategyDetailsModal } from '@/components/modals/StrategyDetailsModal'
import { StrategiesListCard } from '@/components/cards/StrategiesListCard'
import type {
  IStrategy,
  IStrategiesListCard
} from '@/components/cards/StrategiesListCard'
import { BudgetBoxInfoCard } from '@/components/cards/BudgetBoxInfoCard'

interface IBudgetBoxInfoVotingCard extends IStrategiesListCard {
  endDate: Date | null
  startDate: Date
  title: string
}

export const BudgetBoxInfoVotingCard = ({
  endDate,
  startDate,
  title,
  strategies
}: IBudgetBoxInfoVotingCard) => {
  const [selectedStrategy, setSelectedStrategy] = useState<IStrategy>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClose = () => setIsOpen(false)
  const handleClick = (index: number) => {
    setSelectedStrategy(strategies[index])
    setIsOpen(true)
  }

  return (
    <>
      <StrategyDetailsModal
        handleClose={handleClose}
        isOpen={isOpen}
        network={selectedStrategy?.network || ''}
        params={JSON.stringify(selectedStrategy?.params, null, 2) || ''}
        title={selectedStrategy?.name || ''}
      />
      <BudgetBoxInfoCard title={title}>
        <>
          <div className="mt-4 flex w-full justify-between text-gray-500">
            <span>Start Date</span>
            <span>{moment(startDate).format('MMM DD YYYY')}</span>
          </div>
          <div className="mt-4 flex w-full justify-between text-gray-500">
            <span>End Date</span>
            <span>{moment(endDate).format('MMM DD YYYY')}</span>
          </div>
          <div className="mt-4 flex w-full flex-col justify-between text-gray-500">
            <h3>Strategies</h3>
            <StrategiesListCard
              className="mt-2"
              handleClick={handleClick}
              strategies={strategies}
            />
          </div>
        </>
      </BudgetBoxInfoCard>
    </>
  )
}

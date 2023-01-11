import classNames from 'classnames'
import { StrategyTitleCard } from '@/components/cards/StrategyTitleCard'

export interface IStrategy {
  name: string
  params: string
  network: string
}

export interface IStrategiesListCard {
  className?: string
  strategies: Array<IStrategy>
  hasCloseIcon?: boolean
  handleClose?: (index: number) => void
  handleClick?: (index: number) => void
}

export const StrategiesListCard = ({
  className,
  strategies,
  hasCloseIcon = false,
  handleClose,
  handleClick
}: IStrategiesListCard) => {
  return (
    <div
      className={classNames(
        'flex w-full flex-col gap-y-2 overflow-y-scroll rounded-lg border bg-gray-100 p-3',
        className
      )}
    >
      {strategies.length > 0 ? (
        strategies.map(({ name }, index) => (
          <div key={index} className="rounded-lg bg-white">
            <StrategyTitleCard
              hasCloseIcon={hasCloseIcon}
              title={name}
              handleClick={
                handleClick
                  ? () => {
                      handleClick(index)
                    }
                  : () => null
              }
              handleClose={
                handleClose
                  ? () => {
                      handleClose(index)
                    }
                  : () => null
              }
            />
          </div>
        ))
      ) : (
        <h3 className="m-auto text-lg font-medium">No Strategy selected.</h3>
      )}
    </div>
  )
}

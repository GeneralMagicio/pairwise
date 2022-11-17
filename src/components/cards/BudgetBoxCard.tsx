import Link from 'next/link'
import { FC } from 'react'
import { BudgetBox } from '@/types/BudgetBox'

interface IBudgetBoxCard {
  budgetBox: BudgetBox
}

export const BudgetBoxCard: FC<IBudgetBoxCard> = ({ budgetBox }) => {
  return (
    <div className="h-[250px] w-full max-w-[280px] rounded-xl border border-neutral-800 px-4 py-2 shadow-lg">
      <div className="text-lg">{budgetBox.name}</div>
      <div className="text-blue-500">{`Creator: ${budgetBox.creator.slice(
        0,
        6
      )}...${budgetBox.creator.slice(-4)}`}</div>
      <div>{budgetBox.description}</div>
      <Link href={`/vote/${budgetBox.id}`}>
        <div className="mt-2 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-center text-lg font-semibold text-white">
          Vote
        </div>
      </Link>
      <Link href={`/ranking/${budgetBox.id}`}>
        <div className="mt-2 cursor-pointer rounded-lg bg-blue-400 px-4 py-2 text-center text-lg font-semibold text-white">
          See results
        </div>
      </Link>
    </div>
  )
}

import Link from 'next/link'
import { FC } from 'react'
import { BudgetBox } from '@/types/BudgetBox'

interface IBudgetBoxCard {
  budgetBox: BudgetBox
}

export const BudgetBoxCard: FC<IBudgetBoxCard> = ({ budgetBox }) => {
  return (
    <div className="w-[300px] h-[250px] px-4 py-2 border border-neutral-800 rounded-xl shadow-lg">
      <div className="text-lg">{budgetBox.name}</div>
      <div className="text-blue-500">{`Creator: ${budgetBox.creator.slice(
        0,
        6
      )}...${budgetBox.creator.slice(-4)}`}</div>
      <div>{budgetBox.description}</div>
      <Link href={`/vote/${budgetBox.id}`}>
        <div className="mt-2 px-4 py-2 text-center rounded-lg text-lg bg-blue-500 text-white font-semibold cursor-pointer">
          Vote
        </div>
      </Link>
      <Link href={`/ranking/${budgetBox.id}`}>
        <div className="mt-2 px-4 py-2 text-center rounded-lg text-lg bg-blue-400 text-white font-semibold cursor-pointer">
          See results
        </div>
      </Link>
    </div>
  )
}

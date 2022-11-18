import { useRouter } from 'next/router'
import { FC } from 'react'
import { BudgetBox } from '@/types/BudgetBox'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'

interface IBudgetBoxCard {
  budgetBox: BudgetBox
}

export const BudgetBoxCard: FC<IBudgetBoxCard> = ({ budgetBox }) => {
  const router = useRouter()

  const handleClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="h-[250px] w-full max-w-[280px] rounded-xl border border-neutral-800 px-4 py-2 shadow-lg">
      <div className="text-lg">{budgetBox.name}</div>
      <div className="text-blue-500">{`Creator: ${budgetBox.creator.slice(
        0,
        6
      )}...${budgetBox.creator.slice(-4)}`}</div>
      <div>{budgetBox.description}</div>
      <div className="mt-2 h-[50px] w-full">
        <PrimaryButton
          color={ButtonColors.BLUE}
          fontStyles="text-lg"
          label="Vote"
          styles="py-2 px-4"
          onClick={() => handleClick(`vote/${budgetBox.id}`)}
        />
      </div>
      <div className="mt-2 h-[50px] w-full">
        <PrimaryButton
          color={ButtonColors.LIGHT_BLUE}
          fontStyles="text-lg"
          label="See results"
          styles="py-2 px-4"
          onClick={() => handleClick(`ranking/${budgetBox.id}`)}
        />
      </div>
    </div>
  )
}

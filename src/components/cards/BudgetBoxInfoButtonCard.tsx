import { PrimaryButton, ButtonColors } from '../buttons/PrimaryButton'
import { useRouter } from 'next/router'
import { BudgetBoxInfoCard } from '@/components/cards/BudgetBoxInfoCard'
import type { FC } from 'react'

interface IBudgetBoxInfoButtonCard {
  budgetBoxId: string
  description: string
  title: string
}

export const BudgetBoxInfoButtonCard: FC<IBudgetBoxInfoButtonCard> = ({
  budgetBoxId,
  description,
  title
}) => {
  const router = useRouter()

  const handleRedirect = (href: string) => router.push(href)

  return (
    <BudgetBoxInfoCard className="flex flex-col justify-between" title={title}>
      <>
        <div className="font-light text-gray-500 line-clamp-3">
          {description}
        </div>
        <div>
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            fontStyles="font-normal"
            label="Vote Now"
            styles="h-[45px]"
            onClick={() => handleRedirect(`/vote/${budgetBoxId}`)}
          />
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            fontStyles="font-normal"
            label="See Vote Results"
            styles="mt-2 h-[45px]"
            onClick={() => handleRedirect(`/ranking/${budgetBoxId}`)}
          />
        </div>
      </>
    </BudgetBoxInfoCard>
  )
}

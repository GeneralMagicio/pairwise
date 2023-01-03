import { useRouter } from 'next/router'
import { SettingsDropdown } from '@/components/general/SettingsDropdown'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { BudgetBoxInfoCard } from '@/components/cards/BudgetBoxInfoCard'
import { CreateIcon, SettingsIcon } from '@/components/icons'

interface IBudgetBoxInfoButtonCard {
  budgetBoxId: string
  description: string
  title: string
  spaceSlug: string
}

export const BudgetBoxInfoButtonCard = ({
  spaceSlug,
  budgetBoxId,
  description,
  title
}: IBudgetBoxInfoButtonCard) => {
  const router = useRouter()

  const handleRedirect = (href: string) => router.push(href)

  const iconRadius = 9
  const settingsDropdownItems = [
    {
      icon: (
        <i className="grid h-5 w-5 place-content-center rounded-full bg-gray-500 ">
          <CreateIcon height={iconRadius} width={iconRadius} />
        </i>
      ),
      title: 'Create Project',
      path: `/${spaceSlug}/${budgetBoxId}/new`
    },
    {
      icon: (
        <i className="grid h-5 w-5 place-content-center rounded-full bg-gray-500 ">
          <CreateIcon height={iconRadius} width={iconRadius} />
        </i>
      ),
      title: 'Import Project',
      path: `/${spaceSlug}/${budgetBoxId}/import`
    },
    {
      icon: <SettingsIcon />,
      title: 'Settings',
      path: `/${spaceSlug}/${budgetBoxId}/`
    }
  ]

  return (
    <BudgetBoxInfoCard
      className="relative flex min-h-[260px] flex-col justify-between"
      title={title}
    >
      <>
        <div className="font-light text-gray-500 line-clamp-3">
          {description}
        </div>
        <div>
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            fontStyles="font-normal"
            label="Vote Now"
            styles="mt-2 h-[40px]"
            onClick={() => handleRedirect(`/vote/${budgetBoxId}`)}
          />
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            fontStyles="font-normal"
            label="See Vote Results"
            styles="mt-2 h-[40px]"
            onClick={() => handleRedirect(`/ranking/${budgetBoxId}`)}
          />
        </div>
        <div className="absolute right-10 top-8">
          <SettingsDropdown items={settingsDropdownItems} />
        </div>
      </>
    </BudgetBoxInfoCard>
  )
}

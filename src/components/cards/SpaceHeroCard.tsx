import { SettingsDropdown } from '../general/SettingsDropdown'
import Image from 'next/image'
import { HeroCard } from '@/components/cards/HeroCard'
import { SpaceCategoryTags } from '@/components/tags/SpaceCategoryTags'
import { CreateIcon, SettingsIcon } from '@/components/icons'

interface ISpaceHeroCard {
  categories: Array<{ category: string }>
  image: string
  slug: string
  title: string
  description: string
}

export const SpaceHeroCard = ({
  categories,
  image,
  slug,
  title,
  description
}: ISpaceHeroCard) => {
  const iconRadius = 9
  const settingsDropdownItems = [
    {
      icon: (
        <i className="grid h-5 w-5 place-content-center rounded-full bg-gray-500 ">
          <CreateIcon height={iconRadius} width={iconRadius} />
        </i>
      ),
      title: 'New Pairwise',
      path: `/${slug}/new/pairwise`
    },
    {
      icon: <SettingsIcon />,
      title: 'Settings',
      path: `/${slug}`
    }
  ]

  return (
    <HeroCard>
      <>
        <div className="relative mr-8 h-[130px] min-w-[130px] overflow-hidden rounded-full shadow-md">
          <Image fill alt="Space image" sizes="130px" src={image} />
        </div>
        <article className="relative flex flex-col items-start gap-y-2">
          <h2 className="text-4xl font-extrabold">{title}</h2>
          <SpaceCategoryTags categories={categories} />
          <p className="font-light text-gray-500">{description}</p>
        </article>
        <div className="absolute top-8 right-8">
          <SettingsDropdown items={settingsDropdownItems} />
        </div>
      </>
    </HeroCard>
  )
}

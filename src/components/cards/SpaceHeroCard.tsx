import Image from 'next/image'
import { HeroCard } from '@/components/cards/HeroCard'
import { SpaceCategoryTags } from '@/components/tags/SpaceCategoryTags'
import type { FC } from 'react'

interface ISpaceHeroCard {
  categories: Array<{ category: string }>
  image: string
  title: string
  description: string
}
export const SpaceHeroCard: FC<ISpaceHeroCard> = ({
  categories,
  image,
  title,
  description
}) => {
  return (
    <HeroCard>
      <>
        <div className="relative mr-8 h-[130px] min-w-[130px] overflow-hidden rounded-full shadow-md">
          <Image fill alt="Space image" sizes="130px" src={image} />
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-4xl font-extrabold">{title}</div>
          <SpaceCategoryTags categories={categories} />
          <div className="font-light text-gray-500">{description}</div>
        </div>
      </>
    </HeroCard>
  )
}

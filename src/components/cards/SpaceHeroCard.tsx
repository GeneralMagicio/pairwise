import { SpaceCategoryTags } from '../tags/SpaceCategoryTags'
import Image from 'next/image'
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
    <div className="flex h-[220px] w-full items-center rounded-lg border bg-white py-4 px-16 shadow-md">
      <div className="relative mr-8 h-[130px] min-w-[130px] overflow-hidden rounded-full shadow-md">
        <Image fill alt="Space image" sizes="130px" src={image} />
      </div>
      <div className="flex flex-col items-start gap-y-2">
        <div className="text-4xl font-extrabold">{title}</div>
        <SpaceCategoryTags categories={categories} />
        <div className="font-light text-gray-500">{description}</div>
      </div>
    </div>
  )
}

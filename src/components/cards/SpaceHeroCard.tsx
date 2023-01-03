import Image from 'next/image'
import { HeroCard } from '@/components/cards/HeroCard'
import { SpaceCategoryTags } from '@/components/tags/SpaceCategoryTags'

interface ISpaceHeroCard {
  categories: Array<{ category: string }>
  image: string
  title: string
  description: string
}
export const SpaceHeroCard = ({
  categories,
  image,
  title,
  description
}: ISpaceHeroCard) => {
  return (
    <HeroCard>
      <>
        <div className="relative mr-8 h-[130px] min-w-[130px] overflow-hidden rounded-full shadow-md">
          <Image fill alt="Space image" sizes="130px" src={image} />
        </div>
        <article className="flex flex-col items-start gap-y-2">
          <h2 className="text-4xl font-extrabold">{title}</h2>
          <SpaceCategoryTags categories={categories} />
          <p className="font-light text-gray-500">{description}</p>
        </article>
      </>
    </HeroCard>
  )
}

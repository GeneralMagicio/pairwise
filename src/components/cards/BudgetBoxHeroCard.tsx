import Image from 'next/image'
import { HeroCard } from '@/components/cards/HeroCard'

interface IBudgetBoxHeroCard {
  image: string
  title: string
  description: string
}
export const BudgetBoxHeroCard = ({
  image,
  title,
  description
}: IBudgetBoxHeroCard) => {
  return (
    <HeroCard>
      <>
        <div className="relative mr-8 h-[150px] min-w-[250px] overflow-hidden rounded-lg shadow-md">
          <Image
            fill
            alt="Space image"
            className="object-cover"
            sizes="33vh"
            src={image}
          />
        </div>
        <div className="h-[150px]">
          <div className="text-4xl font-extrabold">{title}</div>
          <div className="mt-2 font-light text-gray-500 line-clamp-4">
            {description}
          </div>
        </div>
      </>
    </HeroCard>
  )
}

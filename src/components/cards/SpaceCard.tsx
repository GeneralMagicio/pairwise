import Image from 'next/image'
import Link from 'next/link'
import { SpaceCategoryTags } from '@/components/tags/SpaceCategoryTags'

interface ISpaceCard {
  categories: Array<{ category: string }>
  img: string
  slug: string
  title: string
  description: string
}

export const SpaceCard = ({
  categories,
  img,
  slug,
  title,
  description
}: ISpaceCard) => {
  return (
    <div className="w-full">
      <Link href={`/${slug}`}>
        <div className="flex h-[300px] w-[250px] flex-col items-center gap-y-3 rounded-xl border-2 border-gray-200 bg-white py-8 px-6 shadow-md transition duration-150 hover:shadow-lg hover:shadow-green-400/40">
          <div className="relative h-[64px] w-[64px] overflow-hidden rounded-full shadow-md">
            <Image fill alt="Space image" sizes="64px" src={img} />
          </div>
          <span className="text-center text-xl font-semibold line-clamp-1">
            {title}
          </span>
          <SpaceCategoryTags categories={categories} />
          <span className="text-center text-gray-500 line-clamp-3">
            {description}
          </span>
        </div>
      </Link>
    </div>
  )
}

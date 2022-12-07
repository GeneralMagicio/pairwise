import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

interface ISpaceCard {
  categories: Array<{ category: string }>
  img: string
  slug: string
  title: string
}

export const SpaceCard: FC<ISpaceCard> = ({ categories, img, slug, title }) => {
  return (
    <div className="w-full max-w-[200px]">
      <Link href={`/${slug}`}>
        <div className="flex h-[250px] flex-col items-center justify-between rounded-xl border bg-gray-100  py-8 shadow">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full">
            <Image fill alt="Space image" sizes="100px" src={img} />
          </div>
          <span className="text-xl font-semibold ">{title}</span>

          {categories.length > 0 ? (
            <div className="flex w-full flex-wrap justify-center gap-1 px-2">
              {categories.map(({ category }) => (
                <span
                  key={category}
                  className="rounded-full bg-blue-400 px-2 py-1 text-xs font-bold text-white"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}

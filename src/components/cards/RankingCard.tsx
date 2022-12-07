import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

interface IRankingCard {
  power: number
  title: string
  url?: string
  owner?: string
  description?: string
  image?: string
}

export const RankingCard: FC<IRankingCard> = ({
  power,
  title,
  url,
  owner,
  description,
  image
}) => {
  return (
    <Link
      className="relative max-w-full"
      href={url || '#'}
      target={url ? '_blank' : '_self'}
    >
      <div className="absolute -left-2 -top-2 z-10 flex h-[60px] w-[60px] items-center justify-center  rounded-full border-2 border-blue-300 bg-blue-500 text-lg font-semibold text-white shadow-md md:hidden">
        {`${((power || 0) * 100).toFixed(1)}%`}
      </div>
      <div className="flex h-[250px] w-[1200px] max-w-full cursor-pointer overflow-hidden rounded-xl border-gray-300 bg-gray-200 p-4 shadow-lg duration-100 hover:scale-102">
        <div className="mr-6 hidden w-[150px] items-center justify-center  rounded-xl bg-gray-100 text-2xl font-semibold md:flex lg:text-3xl">
          {`${((power || 0) * 100).toFixed(2)}%`}
        </div>
        <div className="flex w-full flex-col overflow-hidden rounded-xl border bg-white sm:flex-row">
          {image ? (
            <div className="relative h-1/2 w-full overflow-hidden border-r shadow-md sm:h-full sm:w-[400px]">
              <Image
                fill
                priority
                alt="Project Image"
                className="object-cover"
                sizes="500px"
                src={image}
              />
            </div>
          ) : null}
          {owner || description ? (
            <div className="flex flex-col justify-between px-4 pb-4 sm:w-[600px]">
              <div className="mt-2 text-xl">{title}</div>
              <span className="text-blue-500">{owner}</span>
              <div className="line-clamp-2 sm:line-clamp-5">{description}</div>
            </div>
          ) : (
            <div className="flex h-full min-w-full flex-col items-center justify-center px-4 pb-4 sm:w-[1000px]">
              <div className="mt-2 text-center text-3xl font-semibold">
                {title}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

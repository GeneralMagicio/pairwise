import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

interface IRankingCard {
  power: number
  title: string
  url?: string
  owner?: string
  image?: string
}

export const RankingCard: FC<IRankingCard> = ({
  power,
  title,
  url,
  owner,
  image
}) => {
  return (
    <Link href={url || ''} target={url ? '_blank' : '_self'}>
      <div className="flex w-[550px] items-center justify-between rounded-lg bg-white p-6 shadow-sm transition duration-100 hover:bg-green-50">
        {image ? (
          <div className="relative h-[60px] w-[65px] overflow-hidden rounded-xl shadow">
            <Image
              fill
              alt={`${title} logo`}
              className="object-cover"
              sizes="100px"
              src={image}
            />
          </div>
        ) : null}
        <div className="w-[150px]">
          <h3 className="text-sm font-semibold">{title}</h3>
          <h4 className="text-xs font-medium text-gray-500">{owner}</h4>
        </div>
        <p className="w-24 text-center text-2xl font-black text-blue-900">{`${(
          (power || 0) * 100
        ).toFixed(2)}%`}</p>
      </div>
    </Link>
  )
}

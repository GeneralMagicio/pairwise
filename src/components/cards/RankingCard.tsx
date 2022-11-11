import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/project'

export const RankingCard: FC<Project> = ({
  power,
  title,
  url,
  owner,
  description,
  image
}) => {
  return (
    <div className="w-[1200px] max-w-full h-[250px] p-4 flex bg-gray-200 border-gray-300 rounded-xl shadow-lg overflow-hidden hover:scale-102 duration-100 cursor-default">
      <div className="w-[150px] rounded-xl flex items-center justify-center bg-gray-100 text-3xl text-semibold">
        {`${((power || 0) * 100).toFixed(2)}%`}
      </div>
      <div className="flex ml-6 rounded-xl bg-white overflow-hidden">
        <div className="relative w-[400px] shadow-md border-r overflow-hidden">
          <Image
            fill
            alt="Project Image"
            className="object-cover"
            src={image}
          />
        </div>
        <div className="flex flex-col px-4 pb-4 w-[600px] justify-between">
          <div className="text-xl mt-2">{title}</div>
          <span className="text-blue-500">{owner}</span>
          <div className="line-clamp-3">{description}</div>
          <Link href={url} target="_blank">
            <div className="px-4 border py-3 w-30 text-center rounded-lg bg-blue-500 text-white font-semibold cursor-pointer">
              See more...
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

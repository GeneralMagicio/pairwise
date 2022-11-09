import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/project'

export const ProjectCard: FC<Project> = ({
  title,
  url,
  owner,
  description,
  image
}: Project) => {
  return (
    <div>
      <div className="w-[400px] bg-white pb-4 border-gray-300 rounded-xl shadow overflow-hidden">
        <div className="relative h-[220px] w-[400px] drop-shadow">
          <Image
            fill
            alt="Project Image"
            className="object-cover"
            src={image}
          />
        </div>
        <div className="px-4 h-[200px]">
          <div className="text-xl mt-2">{title}</div>
          <span className="text-blue-500">{owner}</span>
          <div className="line-clamp-5">{description}</div>
        </div>
        <div className="mt-4 w-full flex justify-center">
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

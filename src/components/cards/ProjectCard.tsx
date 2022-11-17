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
}) => {
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-xl border-gray-300 bg-white pb-4 shadow">
      <div className="relative h-[120px] w-full drop-shadow lg:h-[220px]">
        <Image fill alt="Project Image" className="object-cover" src={image} />
      </div>
      <div className="h-[120px] px-4 lg:h-[200px]">
        <div className="mt-2 text-lg font-semibold line-clamp-2 lg:text-xl">{title}</div>
        <span className="hidden text-blue-500 lg:inline">{owner}</span>
        <div className="line-clamp-3 lg:line-clamp-5">{description}</div>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <Link href={url} target="_blank">
          <div className="w-32 cursor-pointer rounded-lg border bg-blue-500 px-4 py-2 text-center font-semibold text-white lg:py-3">
            See more...
          </div>
        </Link>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { CircleGradientIcon, CircleGradientTickIcon } from '@/components/icons'
import type { FC } from 'react'

interface IProjectCard {
  isSelected: boolean
  title: string
  url?: string
  owner?: string
  description?: string
  image?: string
}

export const ProjectCard: FC<IProjectCard> = ({
  isSelected,
  title,
  url,
  owner,
  description,
  image
}) => {
  return (
    <div
      className={classNames(
        'h-[470px] w-full cursor-pointer overflow-hidden rounded-lg bg-white pb-4 shadow-md transition duration-200  hover:shadow-cyan-300 hover:ring-2 hover:ring-cyan-300 sm:max-w-[370px]',
        isSelected
          ? 'shadow-lg shadow-cyan-300 ring-4 ring-cyan-300 hover:ring-4 '
          : ''
      )}
    >
      {image ? (
        <div className="relative h-[120px] w-full lg:h-[250px]">
          <Image
            fill
            priority
            alt="Project Image"
            className="object-cover"
            sizes="400px"
            src={image}
          />
        </div>
      ) : null}
      {owner || description ? (
        <div className="px-6">
          <div className="mt-4 text-lg font-semibold line-clamp-1 lg:text-xl">
            {title}
          </div>
          {owner ? (
            <span className="hidden text-xs text-gray-500 lg:inline">
              {owner}
            </span>
          ) : null}
          {description ? (
            <div className="mt-2 text-sm font-light text-gray-500 line-clamp-3">
              {description}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex h-[120px] items-center justify-center px-4 lg:h-[200px]">
          <div className="w-[200px] text-center text-lg font-semibold line-clamp-2 sm:w-[300px] lg:text-3xl">
            {title}
          </div>
        </div>
      )}
      <div className="mx-6 mt-6 flex items-center justify-between">
        {url ? (
          <Link href={url} target="_blank">
            <div className="w-fit font-medium">View Details</div>
          </Link>
        ) : (
          <div></div>
        )}
        {isSelected ? (
          <CircleGradientTickIcon height={32} width={32} />
        ) : (
          <CircleGradientIcon height={32} width={32} />
        )}
      </div>
    </div>
  )
}

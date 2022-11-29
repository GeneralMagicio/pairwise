import Image from 'next/image'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import type { Project } from '@/utils/types/project'
import type { FC } from 'react'

export const ProjectCard: FC<Project> = ({
  title,
  url,
  owner,
  description,
  image
}) => {
  const handleClick = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-xl border-gray-300 bg-white pb-4 shadow">
      <div className="relative h-[120px] w-full drop-shadow lg:h-[220px]">
        <Image
          fill
          priority
          alt="Project Image"
          className="object-cover"
          sizes="400px"
          src={image}
        />
      </div>
      <div className="h-[120px] px-4 lg:h-[200px]">
        <div className="mt-2 text-lg font-semibold line-clamp-2 lg:text-xl">
          {title}
        </div>
        <span className="hidden text-blue-500 lg:inline">{owner}</span>
        <div className="line-clamp-3 lg:line-clamp-5">{description}</div>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <div className="h-[50px] w-fit">
          <PrimaryButton
            color={ButtonColors.LIGHT_BLUE}
            fontStyles="text-lg"
            label="See more..."
            styles="py-2 px-4"
            onClick={() => handleClick(url)}
          />
        </div>
      </div>
    </div>
  )
}

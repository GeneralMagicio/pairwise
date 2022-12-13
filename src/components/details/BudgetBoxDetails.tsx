import Image from 'next/image'
import type { FC } from 'react'

interface IBudgetBoxDetails {
  className?: string
  description: string
  image: string
  title: string
}

export const BudgetBoxDetails: FC<IBudgetBoxDetails> = ({
  className,
  description,
  image,
  title
}) => {
  return (
    <div className={className}>
      <div className="relative h-[390px] w-[660px]">
        <Image
          fill
          alt={`${title} details image`}
          className="object-cover"
          src={image}
        ></Image>
      </div>
      <div className="mt-6 flex w-full items-center font-semibold">
        DETAILS
        <hr className="mx-auto ml-6 inline h-[2px] w-full border-0 bg-black" />
      </div>
      <div className="mt-8 text-4xl font-semibold text-gray-900">{title}</div>
      <div className="mt-4 text-lg font-light text-gray-500">{description}</div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'

interface IBudgetBoxCard {
  id: string
  title: string
  description: string
  image: string
  spaceSlug: string
  startDate: Date
}

export const BudgetBoxCard = ({
  id,
  title,
  description,
  image,
  spaceSlug,
  startDate
}: IBudgetBoxCard) => {
  return (
    <Link
      className="h-[350px] min-w-[330px] overflow-hidden rounded-lg border bg-white shadow-md"
      href={`${spaceSlug}/budget-box/${id}`}
    >
      <div className="relative h-[200px] min-w-[330px] overflow-hidden ">
        <Image
          fill
          alt={`${title}'s image`}
          className="object-cover"
          sizes="33vh"
          src={image}
        />
      </div>
      <div className="m-4 gap-y-1">
        <div className="text-xs text-gray-500">
          {moment(startDate).fromNow()}
        </div>
        <div className="text-lg font-bold text-gray-900 line-clamp-1">
          {title}
        </div>
        <div className="mt-1 font-light text-gray-500 line-clamp-3">
          {description}
        </div>
      </div>
    </Link>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownIcon } from '@/components/icons'

interface INavArrow {
  items: Array<{ name: string; path: string }>
}

export const NavArrow = ({ items }: INavArrow) => {
  return (
    <nav className="mb-6 flex w-fit items-center rounded-lg border bg-gray-50 py-3 px-5">
      <Image
        alt={'Budget boxes logo'}
        height={40}
        src={'/images/logos/budget-boxes-logo.svg'}
        width={40}
      />
      {items.map((item, index) => (
        <>
          {index !== 0 ? (
            <ArrowDownIcon
              className="-rotate-90"
              color="#9CA3AF"
              height={12}
              width={12}
            />
          ) : null}
          <Link href={item.path}>
            <h3
              key={item.path}
              className="relative mx-3 cursor-pointer text-gray-600 before:absolute before:bottom-0 before:left-0 before:block before:h-[2px] before:w-full 
            before:origin-top-left before:scale-x-0 before:bg-gray-800
            before:transition before:duration-300 before:ease-in-out
            before:content-[''] hover:text-gray-800 before:hover:scale-x-100"
            >
              {item.name}
            </h3>
          </Link>
        </>
      ))}
    </nav>
  )
}

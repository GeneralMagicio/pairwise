import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

const sidebarItems = [
  {
    title: 'Home',
    alt: 'Home button',
    link: '/',
    image: '/images/icons/home-icon.svg'
  },
  {
    title: 'New Space',
    alt: 'New Space button',
    link: '/create',
    image: '/images/icons/create-icon.svg'
  }
]

export const Sidebar = ({ children }: IAppLayout) => {
  return (
    <div className="flex min-h-[calc(100vh_-_100px)]">
      <aside className="sticky top-[100px] hidden h-[calc(100vh_-_100px)] w-[180px] flex-col items-start justify-start gap-y-10 bg-blue-50 pl-6 pt-8 sm:flex">
        {sidebarItems.map((item) => (
          <Link key={item.title} className="flex items-center" href={'/'}>
            <Image alt={item.alt} height={25} src={item.image} width={25} />
            <h3 className="ml-2 text-gray-500">{item.title}</h3>
          </Link>
        ))}
      </aside>
      <main className="w-full">{children}</main>
    </div>
  )
}

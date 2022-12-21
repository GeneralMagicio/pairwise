import Link from 'next/link'
import { CreateIcon, HomeIcon } from '@/components/icons'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

const iconSize = 15
const sidebarItems = [
  {
    title: 'Home',
    alt: 'Home button',
    link: '/',
    icon: <HomeIcon height={iconSize} width={iconSize} />
  },
  {
    title: 'New Space',
    alt: 'New Space button',
    link: '/new/space',
    icon: <CreateIcon height={iconSize} width={iconSize} />
  }
]

export const Sidebar = ({ children }: IAppLayout) => {
  return (
    <div className="flex min-h-[calc(100vh_-_100px)]">
      <aside className="sticky top-[100px] hidden h-[calc(100vh_-_100px)] min-w-[220px] flex-col items-start justify-start gap-y-10 bg-blue-50 pl-6 pt-8 sm:flex">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            className="flex items-center transition duration-150 hover:opacity-80"
            href={item.link}
          >
            <div className="grid h-7 w-7 place-content-center rounded-full bg-gradient-to-b from-blue-500 to-cyan-300 ">
              {item.icon}
            </div>
            <h3 className="ml-2 text-gray-600">{item.title}</h3>
          </Link>
        ))}
      </aside>
      <div className="w-full py-12">{children}</div>
    </div>
  )
}

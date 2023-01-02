import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { CreateIcon, HomeIcon } from '@/components/icons'

const iconSize = 15
const sidebarItems = [
  {
    title: 'Home',
    alt: 'Home button',
    path: '/',
    icon: <HomeIcon height={iconSize} width={iconSize} />
  },
  {
    title: 'New Space',
    alt: 'New Space button',
    path: '/new/space',
    icon: <CreateIcon height={iconSize} width={iconSize} />
  }
]

export const Sidebar = () => {
  const router = useRouter()

  return (
    <aside className="sticky top-0 z-30 hidden h-screen min-w-[287px] flex-col items-start justify-start gap-y-12 bg-white pl-8 pt-11 shadow-xl sm:flex">
      <Link className="flex items-center pl-3" href={'/'}>
        <Image
          alt={'Budget boxes logo'}
          height={40}
          src={'/images/logos/budget-boxes-logo.svg'}
          width={40}
        />
        <h2 className="ml-3 font-poppins text-2xl font-bold">Pairwise</h2>
      </Link>
      {sidebarItems.map((item) => (
        <Link
          key={item.title}
          href={item.path}
          className={classNames(
            'group flex w-48 items-center rounded-md bg-white py-3 pl-6 transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-cyan-500 hover:text-white',
            router.asPath == item.path
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
              : 'text-gray-500'
          )}
        >
          <i
            className={classNames(
              'grid h-7 w-7 place-content-center rounded-full bg-gradient-to-b from-blue-500 to-cyan-300 group-hover:bg-none',
              router.asPath == item.path ? 'bg-none' : ''
            )}
          >
            {item.icon}
          </i>
          <h3 className="ml-3 font-poppins font-semibold">{item.title}</h3>
        </Link>
      ))}
    </aside>
  )
}

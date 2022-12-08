import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

export const Sidebar = ({ children }: IAppLayout) => {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[100px] flex-col items-center justify-start gap-y-12 border-r bg-blue-50 pt-8 sm:flex">
        <Link href={'/'}>
          <Image
            alt={'Budget boxes logo'}
            height={70}
            src={'/images/logos/budget-boxes-logo.svg'}
            width={70}
          />
        </Link>
        <Link href={'/create'}>
          <Image
            alt={'Create space button'}
            height={40}
            src={'/images/icons/create-icon.svg'}
            width={40}
          />
        </Link>
      </aside>
      <main className="w-full">{children}</main>
    </div>
  )
}

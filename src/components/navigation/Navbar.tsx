import Link from 'next/link'
import Image from 'next/image'
import { CustomConnectButton } from '@/components/buttons/ConnectButton'
import type { FC } from 'react'

export const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 z-20 flex h-[100px] w-full items-center justify-between bg-blue-50 px-8">
      <Link className="flex items-center" href={'/'}>
        <Image
          alt={'Budget boxes logo'}
          height={50}
          src={'/images/logos/budget-boxes-logo.svg'}
          width={50}
        />
        <h2 className="ml-3 text-2xl font-semibold">Budget Boxes</h2>
      </Link>
      <CustomConnectButton />
    </nav>
  )
}

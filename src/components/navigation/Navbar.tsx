import { FC } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'


export const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 bg-white h-28 w-full flex justify-between items-center px-12 shadow-md">
      <Link href="/">
        <div className="font-semibold text-xl cursor-pointer">Budget Boxes</div>
      </Link>
      <ConnectButton />
    </nav>
  )
}
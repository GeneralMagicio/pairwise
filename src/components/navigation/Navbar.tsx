import { FC } from 'react'
import Link from 'next/link'

export const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 bg-white h-24 w-full flex items-center px-8 shadow-md">
      <Link href="/">
        <div className="font-semibold text-xl cursor-pointer">Budget Boxes</div>
      </Link>
    </nav>
  )
}
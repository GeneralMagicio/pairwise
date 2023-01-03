import Link from 'next/link'
import { useState } from 'react'
import { EllipsisIcon } from '@/components/icons'
import type { ReactElement } from 'react'

interface ISettingsDropdownItem {
  icon: ReactElement
  title: string
  path: string
}

interface ISettingsDropdown {
  items: Array<ISettingsDropdownItem>
}

export const SettingsDropdown = ({ items }: ISettingsDropdown) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleIsOpen = () => setIsOpen((prevState) => !prevState)

  return (
    <div className="relative" onClick={toggleIsOpen}>
      <i className="cursor-pointer">
        <EllipsisIcon />
      </i>
      {isOpen ? (
        <div
          className="absolute top-6 -right-2 rounded-md border bg-white py-3 px-5 shadow-sm"
          onMouseLeave={toggleIsOpen}
        >
          <ul className="flex w-40 flex-col gap-y-3 ">
            {items.map(({ icon, path, title }) => (
              <li key={title}>
                <Link
                  className="flex items-center gap-x-2 text-gray-500 transition duration-200 hover:font-medium hover:text-gray-900"
                  href={path}
                >
                  {icon}
                  <h4>{title}</h4>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

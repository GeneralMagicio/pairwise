import { RegistrationMain } from '@/components/registration/layout/RegistrationMain'
import { RegistrationSidebar } from '@/components/registration/layout/RegistrationSidebar'
import type { ReactElement } from 'react'

interface IRegistrationLayout {
  children: ReactElement
  options: Array<string>
  selected: number
  title: string
}

export const RegistrationLayout = ({
  children,
  options,
  selected,
  title
}: IRegistrationLayout) => {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-6">
      <div className="col-span-1">
        <RegistrationSidebar options={options} selected={selected} />
      </div>
      <div className="col-span-3">
        <RegistrationMain title={title}>{children}</RegistrationMain>
      </div>
    </div>
  )
}

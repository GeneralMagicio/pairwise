import type { ReactElement } from 'react'

interface IRegistrationMain {
  children: ReactElement
  title: string
}

export const RegistrationMain = ({ children, title }: IRegistrationMain) => {
  return (
    <section className="flex h-full min-h-fit w-full flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

import type { FC, ReactElement } from 'react'

interface IHeroCard {
  children: ReactElement
}

export const HeroCard: FC<IHeroCard> = ({ children }) => {
  return (
    <div className="flex h-[220px] w-full items-center rounded-lg border bg-white py-4 px-16 shadow-md">
      {children}
    </div>
  )
}

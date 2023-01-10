import { GitHubIcon, CloseIcon } from '@/components/icons'
import type { MouseEventHandler } from 'react'

interface IStrategyTitleCard {
  author?: string
  title: string
  version?: string
  hasCloseIcon?: boolean
  handleClose?: MouseEventHandler<HTMLDivElement>
  handleClick?: MouseEventHandler<HTMLDivElement>
}

export const StrategyTitleCard = ({
  author,
  title,
  version,
  hasCloseIcon = false,
  handleClose,
  handleClick
}: IStrategyTitleCard) => {
  return (
    <div
      className="relative flex min-w-full cursor-pointer items-center justify-between rounded-lg border px-6 py-4 text-gray-800"
      id={title}
      onClick={handleClick}
    >
      <div>
        <h3 className="inline text-xl font-semibold">{title}</h3>
        <p className="ml-1 inline text-sm font-medium">{version}</p>
        {author ? (
          <div className="mt-2 flex items-center">
            <GitHubIcon color="#111928" />
            <p className="ml-2">{author}</p>
          </div>
        ) : null}
      </div>
      {hasCloseIcon ? (
        <div onClick={handleClose}>
          <CloseIcon />
        </div>
      ) : null}
    </div>
  )
}

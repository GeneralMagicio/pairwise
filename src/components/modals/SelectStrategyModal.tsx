import { ModalLayout } from '@/components/modals/ModalLayout'
import { SearchInput } from '@/components/inputs/SearchInput'
import { StrategyTitleCard } from '@/components/cards/StrategyTitleCard'
import { useSearchInput } from '@/hooks/useSearchInput'
import { textSearch } from '@/utils/helpers/textSearch'
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react'

interface ISelectStrategyModal {
  data: Array<{
    id: string
    author: string
    version: string
  }>
  isOpen: boolean
  handleClose: () => void
  setSelectedStrategy: Dispatch<SetStateAction<string>>
}

export const SelectStrategyModal = ({
  data,
  isOpen,
  handleClose,
  setSelectedStrategy
}: ISelectStrategyModal) => {
  const { search, searchInputHandler } = useSearchInput()

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setSelectedStrategy(e.currentTarget.id)
  }

  return (
    <ModalLayout closeModal={handleClose} isOpen={isOpen}>
      <>
        <h2 className="text-xl font-medium">Add Strategy</h2>
        <SearchInput
          placeholder="Test"
          value={search}
          onChange={searchInputHandler}
        />
        <div className="mt-2 flex h-[400px] w-full flex-col gap-y-3 overflow-y-scroll rounded-lg border p-4">
          {Array.isArray(data)
            ? data
                .filter(({ author, id }) => textSearch(search, [author, id]))
                .map(({ author, id, version }, index) => (
                  <StrategyTitleCard
                    key={index}
                    author={author}
                    handleClick={handleClick}
                    title={id}
                    version={version}
                  />
                ))
            : 'Loading...'}
        </div>
      </>
    </ModalLayout>
  )
}

import { SearchIcon } from '@/components/icons'
import type { FC, FormEvent } from 'react'

interface ISearchInput {
  placeholder: string
  value?: string
  onChange?: (event: FormEvent<HTMLInputElement>) => void
}

export const SearchInput: FC<ISearchInput> = ({
  placeholder,
  value,
  onChange
}) => {
  return (
    <form className="flex items-center">
      <input
        className="h-[45px] w-[350px] rounded-xl rounded-r-none border-2 border-r-0 bg-gray-50 pl-4 font-light hover:border-blue-300 focus:border-blue-400 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></input>
      <button
        className="grid h-[45px] w-[45px] place-content-center rounded-r-xl border border-blue-500 bg-gradient-to-b from-blue-500 to-cyan-300"
        disabled={true}
      >
        <SearchIcon height={20} width={20} />
      </button>
    </form>
  )
}

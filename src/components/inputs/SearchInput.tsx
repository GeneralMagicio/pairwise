import classNames from 'classnames'
import { SearchIcon } from '@/components/icons'
import type { FormEvent } from 'react'

export interface ISearchInput {
  className?: string
  inputStyle?: string
  placeholder: string
  value?: string
  onChange?: (event: FormEvent<HTMLInputElement>) => void
}

export const SearchInput = ({
  className,
  inputStyle,
  placeholder,
  value,
  onChange
}: ISearchInput) => {
  return (
    <form className={classNames('flex items-center', className)}>
      <input
        placeholder={placeholder}
        value={value}
        className={classNames(
          'h-full min-h-[45px] w-[350px] rounded-xl rounded-r-none border border-r-0 border-gray-300 bg-gray-50 pl-4 font-light hover:border-blue-300 focus:border-blue-400 focus:outline-none',
          inputStyle
        )}
        onChange={onChange}
      ></input>
      <button
        className="grid h-full min-h-[45px] w-[45px] place-content-center rounded-r-xl border border-blue-500 bg-gradient-to-b from-blue-500 to-cyan-300"
        disabled={true}
      >
        <SearchIcon height={20} width={20} />
      </button>
    </form>
  )
}

import type { ISelector } from '@/components/inputs/Selector'
import { Selector } from '@/components/inputs/Selector'
import type { ISearchInput } from '@/components/inputs/SearchInput'
import { SearchInput } from '@/components/inputs/SearchInput'

interface ISearchInputWithSelector extends ISelector, ISearchInput {}

export const SearchInputWithSelector = ({
  placeholder,
  onChange,
  value,
  handleSelect,
  options,
  selected
}: ISearchInputWithSelector) => {
  return (
    <div className="flex">
      <Selector
        className="rounded-r-none"
        handleSelect={handleSelect}
        options={options}
        selected={selected}
      />
      <SearchInput
        inputStyle="rounded-l-none border-l-0"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

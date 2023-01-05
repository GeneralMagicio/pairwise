import { useState } from 'react'
import type { FormEvent } from 'react'

export const useSearchInput = () => {
  const [search, setSearch] = useState<string>('')

  const searchInputHandler = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSearch((event.target as HTMLInputElement).value)
  }

  return { search, searchInputHandler }
}

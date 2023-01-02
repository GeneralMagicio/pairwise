import { useState } from 'react'

export const useSelector = (
  categories: Array<string>,
  initialSelected?: string
) => {
  const [selected, setSelected] = useState<string>(initialSelected || '')

  const handleSelect = (index: number) => {
    if (categories && categories[index]) {
      setSelected(categories[index] || '')
    }
  }

  return { selected, handleSelect }
}

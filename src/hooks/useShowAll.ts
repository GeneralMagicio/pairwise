import { useState } from 'react'

export const useShowAll = () => {
  const maxItems = 12
  const [showAll, setShowAll] = useState<boolean>(false)

  return { showAll, setShowAll, maxItems }
}

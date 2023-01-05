import { useState } from 'react'

export const useShowAll = (maxItems = 12) => {
  const [showAll, setShowAll] = useState<boolean>(false)

  return { showAll, setShowAll, maxItems }
}

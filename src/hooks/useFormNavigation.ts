import { useState } from 'react'

export const useFormNavigation = () => {
  const [selected, setSelected] = useState<number>(0)
  const handleNavigation = (indexChange: number) => {
    setSelected((prevSelected) => prevSelected + indexChange)
  }

  return { selected, setSelected, handleNavigation }
}

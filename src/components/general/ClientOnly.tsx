import { FC, ReactNode, useState, useEffect } from 'react'

interface IClientOnly {
  children: ReactNode
}

export const ClientOnly: FC<IClientOnly> = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <div {...delegated}>{children}</div>
}

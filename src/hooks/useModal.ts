import { useState, useEffect } from 'react'

interface IUseModal {
  dependency?: boolean
  onCloseModal?: () => void
}

export const useModal = ({
  dependency = false,
  onCloseModal = () => null
}: IUseModal) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const closeModal = () => {
    onCloseModal()
    setIsModalOpen(false)
  }

  useEffect(() => {
    setIsModalOpen(dependency)
  }, [dependency])

  return { isModalOpen, setIsModalOpen, closeModal }
}

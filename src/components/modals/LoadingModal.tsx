import { ModalLayout } from './ModalLayout'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import type { IModalLayout } from './ModalLayout'

interface ILoadingModal extends IModalLayout {
  title: string
}

export const LoadingModal = ({ closeModal, isOpen, title }: ILoadingModal) => {
  return (
    <ModalLayout closeIcon={false} closeModal={closeModal} isOpen={isOpen}>
      <>
        <LoadingIcon height={24} width={24} />
        <h2 className="mt-4 text-3xl font-extrabold text-blue-900">{title}</h2>
      </>
    </ModalLayout>
  )
}

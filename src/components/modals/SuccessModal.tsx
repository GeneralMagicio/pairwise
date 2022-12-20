import { ModalLayout } from './ModalLayout'
import { SuccessIcon } from '@/components/icons/'
import type { IModalLayout } from './ModalLayout'

interface ISuccessModal extends IModalLayout {
  isOpen: boolean
  title: string
}

export const SuccessModal = ({ closeModal, isOpen, title }: ISuccessModal) => {
  return (
    <ModalLayout closeModal={closeModal} isOpen={isOpen}>
      <>
        <SuccessIcon />
        <h2 className="text-2xl font-extrabold text-blue-900">{title}</h2>
        <p className="text-center text-lg font-light text-gray-500">
          You have successfully registered your project space. Proceed to
          creating budget box for your space.
        </p>
      </>
    </ModalLayout>
  )
}

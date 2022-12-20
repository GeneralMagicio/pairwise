import { motion, AnimatePresence } from 'framer-motion'
import { CloseIcon } from '@/components/icons'
import type { ReactElement } from 'react'

export interface IModalLayout {
  closeIcon?: boolean
  isOpen: boolean
  closeModal?: () => void
  children?: ReactElement
}

export const ModalLayout = ({
  isOpen,
  closeModal,
  children,
  closeIcon = true
}: IModalLayout) => {
  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 bottom-0 z-20 flex items-center justify-center bg-gray-500/75  placeholder:text-opacity-75"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            animate="visible"
            className="relative w-full max-w-xl rounded-lg bg-white py-10 px-8"
            exit="exit"
            initial="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {closeIcon ? (
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={closeModal}
              >
                <CloseIcon />
              </div>
            ) : null}
            <div className="flex flex-col items-center gap-y-4 px-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

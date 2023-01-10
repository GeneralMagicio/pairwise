import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'
import { ArrowDownIcon } from '@/components/icons'

const variants = {
  open: {
    rotate: 0
  },
  close: {
    rotate: -180
  }
}

export interface ISelector {
  className?: string
  comboBoxClassName?: string
  selected: string
  options: Array<string>
  handleSelect: (option: number) => void
}

export const Selector = ({
  className,
  comboBoxClassName,
  selected,
  options,
  handleSelect
}: ISelector) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div
        className={classNames(
          'relative flex w-48 items-center justify-between rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 text-gray-900',
          className
        )}
        onClick={() => setOpen(!open)}
      >
        {selected}
        <motion.div
          animate={open ? 'open' : 'close'}
          initial={false}
          transition={{ duration: 0.3 }}
          variants={variants}
        >
          <ArrowDownIcon color="#111928" height={12} width={12} />
        </motion.div>
        <AnimatePresence>
          {open ? (
            <motion.div
              animate={{ height: 'fit-content', opacity: 100 }}
              exit={{ height: '0px', opacity: 0 }}
              initial={{ height: '0', opacity: 0 }}
              className={classNames(
                'absolute top-14 left-0 z-10 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded-lg border border-gray-300 bg-white text-gray-900',
                comboBoxClassName
              )}
              transition={{
                ease: 'easeInOut',
                duration: 0.3
              }}
              onClick={() => setOpen(false)}
              onMouseLeave={() => setOpen(false)}
            >
              {options.map((option, index) => (
                <motion.div
                  key={option}
                  animate={{ opacity: 100, transition: { delay: 0.2 } }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    'flex cursor-pointer items-center gap-x-2 py-4 pl-6 hover:bg-green-50'
                  }
                  onClick={() => handleSelect(index)}
                >
                  <span>{option}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownIcon } from '@/components/icons'
import type { FC } from 'react'

const variants = {
  open: {
    rotate: 0
  },
  close: {
    rotate: -180
  }
}

interface ISelector {
  selected: string
  options: Array<{ name: string }>
  handleSelect: (option: number) => void
}

export const Selector: FC<ISelector> = ({
  selected,
  options,
  handleSelect
}) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div>
      <div
        className="flex w-48 items-center justify-between rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 text-gray-900"
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
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ height: 'fit-content', opacity: 100 }}
            className="absolute z-10 mt-2 flex w-48 flex-col overflow-hidden rounded-lg border border-gray-300 bg-gray-100 text-gray-900"
            exit={{ height: '0px', opacity: 0 }}
            initial={{ height: '0', opacity: 0 }}
            transition={{
              ease: 'easeInOut',
              duration: 0.3
            }}
            onClick={() => setOpen(false)}
            onMouseLeave={() => setOpen(false)}
          >
            {options.map((option, index) => (
              <motion.div
                key={option.name}
                animate={{ opacity: 100, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  'flex cursor-pointer items-center gap-x-2 py-4 pl-6 hover:bg-gray-100'
                }
                onClick={() => handleSelect(index)}
              >
                <span>{option.name}</span>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

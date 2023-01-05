import classNames from 'classnames'
import type { Dispatch, SetStateAction } from 'react'

interface ISwitch {
  checked: boolean
  className?: string
  setChecked: Dispatch<SetStateAction<boolean>>
  title: string
}

export const Switch = ({ checked, className, setChecked, title }: ISwitch) => {
  return (
    <div
      className={classNames('flex items-center', className ? className : '')}
    >
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          checked={checked}
          className="peer sr-only"
          type="checkbox"
          value=""
          onChange={() => setChecked((prevState) => !prevState)}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 "></div>
        <span className="ml-3 text-gray-700 peer-checked:font-semibold peer-checked:text-gray-700">
          {title}
        </span>
      </label>
    </div>
  )
}

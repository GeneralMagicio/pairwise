import classNames from 'classnames'

interface IRadioButtonGroup {
  disabled?: boolean
  name: string
  title: string
}

export const RadioButtonGroup = ({
  disabled = false,
  name,
  title
}: IRadioButtonGroup) => {
  return (
    <>
      <label htmlFor={name}>{title}</label>
      <input
        name={name}
        placeholder="Select date"
        type="date"
        className={classNames(
          'peer mt-1 h-[42px] w-full rounded-lg border border-gray-300 bg-gray-50 px-4 placeholder-gray-200 transition duration-150 invalid:bg-opacity-10 hover:border-cyan-300/70 focus:border-cyan-300 focus:outline-0',
          disabled && 'bg-gray-200 bg-opacity-20 text-gray-500'
        )}
      />
    </>
  )
}

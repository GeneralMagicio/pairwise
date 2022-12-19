import { useField } from 'formik'
import classNames from 'classnames'

interface IFormSelector {
  disabled?: boolean
  name: string
  options: Array<string>
  title: string
}

export const FormSelector = ({
  disabled = false,
  name,
  options,
  title
}: IFormSelector) => {
  const [field, meta] = useField(name)

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={name}>{title}</label>
      <select
        id={name}
        className={classNames(
          'peer rounded-lg border border-gray-200 bg-gray-50 py-2 px-4 transition duration-150 hover:border-cyan-300/70 focus:border-cyan-300 focus:outline-0',
          disabled && 'bg-gray-200 bg-opacity-20 text-gray-500',
          meta.touched && meta.error ? 'border-red-500 bg-red-100/20' : ''
        )}
        {...field}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div>
          <span className="text-xs text-red-400"> {meta.error}</span>
        </div>
      ) : null}
    </div>
  )
}

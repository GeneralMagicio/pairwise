import { TickIcon } from '../icons'
import classNames from 'classnames'
interface IRegistrationSidebar {
  options: Array<string>
  selected: number
}

export const RegistrationSidebar = ({
  options,
  selected
}: IRegistrationSidebar) => {
  return (
    <aside className="mx-auto mb-8 w-[600px] rounded-lg bg-white p-6 shadow-lg">
      <ul className="grid gap-y-4">
        {options.map((option, index) => (
          <li
            key={option}
            className={classNames(
              'flex items-center justify-between font-semibold',
              index === selected ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            <h3>{option}</h3>
            {index === selected ? <TickIcon /> : null}
          </li>
        ))}
      </ul>
    </aside>
  )
}

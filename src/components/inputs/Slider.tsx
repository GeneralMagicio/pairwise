import { useField } from 'formik'

interface ISlider {
  max: number
  min: number
  name: string
  title: string
}

export const Slider = ({ max, min, name, title, ...props }: ISlider) => {
  const [field] = useField(name)
  return (
    <div className="p-4">
      <label htmlFor="slider">{title}</label>
      <input
        className="w-full accent-blue-600"
        id="slider"
        max={max}
        min={min}
        step={(max - min) / 20}
        type="range"
        {...field}
        {...props}
      />
      <div className="-mt-2 flex w-full justify-between">
        <span className="text-sm text-gray-600">{min}</span>
        <span className="text-sm text-gray-600">{max}</span>
      </div>
    </div>
  )
}

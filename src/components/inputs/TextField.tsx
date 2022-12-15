import Image from 'next/image'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useField } from 'formik'
import type { ChangeEvent, MouseEvent, HTMLInputTypeAttribute } from 'react'

interface ITextField {
  inputRef?: HTMLInputElement | null
  disabled?: boolean
  errorMessage?: string
  maxLength?: number
  name: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onMouseOut?: (e: MouseEvent<HTMLInputElement>) => void
  onMouseOver?: (e: MouseEvent<HTMLInputElement>) => void
  pattern?: string
  placeholder?: string
  title: string
  type?: HTMLInputTypeAttribute
  value?: string
}

export function TextField({
  disabled = false,
  errorMessage,
  maxLength = 30,
  name,
  pattern,
  placeholder,
  onMouseOut,
  onMouseOver,
  title,
  type,
  ...props
}: ITextField) {
  const [visibility, setVisibility] = useState<boolean>(false)
  const [field, meta] = useField(name)

  return (
    <div className="relative flex flex-col gap-y-2">
      <label htmlFor={name}>{title}</label>
      <input
        disabled={disabled}
        id={name}
        maxLength={maxLength}
        pattern={pattern}
        placeholder={placeholder}
        type={visibility ? 'text' : type}
        className={classNames(
          'peer h-[42px] w-full rounded-lg border border-gray-300 bg-gray-50 pl-4 placeholder-gray-200 transition duration-150 invalid:bg-opacity-10 hover:border-cyan-300/70 focus:border-cyan-300 focus:outline-0',
          disabled && 'bg-gray-200 bg-opacity-20 text-gray-500',
          meta.touched && meta.error ? 'border-red-500 bg-red-100/20' : ''
        )}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div>
          <span className="text-xs text-red-400"> {meta.error}</span>
        </div>
      ) : null}
      <div className="peer hidden peer-invalid:block">
        <span className="text-xs text-red-400">{errorMessage}</span>
      </div>
      {type === 'password' && (
        <div
          className="absolute bottom-2 right-8 cursor-pointer"
          onClick={() => setVisibility(!visibility)}
        >
          {visibility ? (
            <Image
              alt="Hide icon"
              height="20"
              src="/icons/hide.svg"
              width="20"
            />
          ) : (
            <Image
              alt="Show icon"
              height="20"
              src="/icons/show.svg"
              width="20"
            />
          )}
        </div>
      )}
    </div>
  )
}

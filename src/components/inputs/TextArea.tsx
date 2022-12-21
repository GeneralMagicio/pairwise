import React from 'react'
import classNames from 'classnames'
import { useField } from 'formik'
import type { ChangeEvent } from 'react'

interface ITextArea {
  className?: string
  disabled?: boolean
  maxLength?: number
  name: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  title: string
  value?: string
}

export function TextArea({
  className,
  disabled = false,
  maxLength,
  name,
  placeholder,
  title,
  ...props
}: ITextArea) {
  const [field, meta] = useField(name)

  return (
    <div className="my-3 flex flex-col">
      <label htmlFor={name}>{title}</label>
      <textarea
        disabled={disabled}
        id={name}
        maxLength={maxLength || 250}
        placeholder={placeholder}
        rows={6}
        className={classNames(
          'peer mt-1 rounded-lg border border-gray-200 bg-gray-50 py-2 px-4 transition duration-150 hover:border-cyan-300/70 focus:border-cyan-300 focus:outline-0',
          disabled && 'bg-gray-200 bg-opacity-20 text-gray-500',
          meta.touched && meta.error ? 'border-red-500 bg-red-100/20' : '',
          className
        )}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div>
          <span className="text-xs text-red-400"> {meta.error}</span>
        </div>
      ) : null}
    </div>
  )
}

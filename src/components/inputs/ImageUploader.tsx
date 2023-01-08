import classNames from 'classnames'
import Image from 'next/image'
import type { FormEventHandler, Dispatch, SetStateAction } from 'react'

interface IImageUploader {
  height: number | string
  setFile: Dispatch<SetStateAction<File | undefined>>
  image?: string
  setImage: Dispatch<SetStateAction<string>>
  rounded?: true
  width: number | string
}

export const ImageUploader = ({
  height,
  setFile,
  image,
  setImage,
  rounded,
  width
}: IImageUploader) => {
  const handleChange: FormEventHandler<HTMLDivElement> = (event) => {
    const reader = new FileReader()

    reader.onload = function (onLoadEvent) {
      if (typeof onLoadEvent.target?.result == 'string') {
        setImage(onLoadEvent.target.result)
      }
    }
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      setFile(target.files[0])
      reader.readAsDataURL(target.files[0])
    }
  }

  return (
    <div className="flex flex-col items-center gap-y-4">
      <div
        style={{ height: height, width: width }}
        className={classNames(
          'relative overflow-hidden rounded-lg bg-gradient-to-b from-blue-500 to-cyan-300 shadow-lg',
          rounded ? 'rounded-full' : ''
        )}
      >
        {image ? (
          <Image
            fill
            alt="profile image"
            className="object-cover"
            src={image}
          />
        ) : null}
      </div>

      <div className="flex flex-col items-center" onChange={handleChange}>
        <label className="flex cursor-pointer items-center rounded-lg bg-gradient-to-b from-blue-500 to-cyan-300 py-2 px-3">
          <p className="text-lg text-white">Choose Avatar</p>
          <input
            accept="image/png, image/gif, image/jpeg, image/webp"
            className="hidden"
            type="file"
          />
        </label>
      </div>
    </div>
  )
}

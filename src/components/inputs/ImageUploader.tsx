import classNames from 'classnames'
import Image from 'next/image'
import type { FormEventHandler, Dispatch, SetStateAction } from 'react'

interface IImageUploader {
  height: number
  setFile: Dispatch<SetStateAction<File | undefined>>
  image?: string
  setImage: Dispatch<SetStateAction<string>>
  rounded?: true
  width: number
}

export const ImageUploader = ({
  height,
  setFile,
  image,
  setImage,
  rounded,
  width
}: IImageUploader) => {
  const handleChange: FormEventHandler<HTMLFormElement> = (event) => {
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
      {image ? (
        <Image
          alt="profile image"
          height={height}
          src={image}
          width={width}
          className={classNames(
            'shadow-lg',
            rounded ? 'rounded-full' : 'rounded-lg'
          )}
        />
      ) : (
        <div
          style={{ height: height, width: width }}
          className={classNames(
            'rounded-lg bg-gradient-to-b from-blue-500 to-cyan-300',
            rounded ? 'rounded-full' : ''
          )}
        ></div>
      )}

      <form className="flex flex-col items-center" onChange={handleChange}>
        <label className="flex cursor-pointer items-center rounded-lg bg-gradient-to-b from-blue-500 to-cyan-300 py-2 px-3">
          <p className="text-lg text-white">Choose Avatar</p>
          <input
            accept="image/png, image/gif, image/jpeg"
            className="hidden"
            type="file"
          />
        </label>
      </form>
    </div>
  )
}

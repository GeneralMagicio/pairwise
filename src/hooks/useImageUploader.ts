import { useState } from 'react'
import axios from 'axios'

export const useImageUploader = () => {
  const [spaceImage, setSpaceImage] = useState<string>('')
  const [spaceImageFile, setSpaceImageFile] = useState<File>()

  const uploadImage = (formData: FormData) =>
    axios.post(
      'https://api.cloudinary.com/v1_1/pairwisevote/image/upload',
      formData
    )

  return {
    spaceImage,
    setSpaceImage,
    spaceImageFile,
    setSpaceImageFile,
    uploadImage
  }
}

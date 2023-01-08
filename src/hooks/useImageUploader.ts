import { useState } from 'react'
import axios from 'axios'

export const useImageUploader = () => {
  const [image, setImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File>()

  const uploadImage = (formData: FormData) =>
    axios.post(
      'https://api.cloudinary.com/v1_1/pairwisevote/image/upload',
      formData
    )

  return {
    image,
    setImage,
    imageFile,
    setImageFile,
    uploadImage
  }
}

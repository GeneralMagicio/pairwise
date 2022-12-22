import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { LoadingModal } from '@/components/modals/LoadingModal'
import { useModal } from '@/hooks/useModal'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
import type { FormikHelpers } from 'formik'

interface Values {
  name: string
  owner: string
  image: string
  url: string
  description: string
}

const options = ['Import a project']

export const ProjectImportView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [name, setname] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [url, setUrl] = useState<string>('')
  const urlDomain = url.match(/(?:[^:]+:\/\/)(?:www\.)*([.a-z0-9]+)+/)?.[1]
  const urlSlug = url.match(/[^\/]+/g)?.pop()

  const router = useRouter()
  const budgetBoxId = router.query.budgetBoxId as string
  const spaceSlug = router.query.spaceSlug as string
  const { isModalOpen, setIsModalOpen } = useModal({})
  const { address, signIn } = useSiwe()

  const { data: givethData, isSuccess: isSuccessGiveth } =
    trpc.giveth.getOneProjectBySlug.useQuery(
      { slug: urlSlug || '' },
      {
        enabled:
          typeof urlSlug === 'string' &&
          urlSlug !== '' &&
          urlDomain === 'giveth.io'
      }
    )

  const { data: space, isSuccess: isSuccessSpace } =
    trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const insertOneProjectMutation = trpc.project.insertOne.useMutation({
    onSettled: (data, error) => {
      if (!error) {
        router.push({
          pathname: `/${spaceSlug}/${budgetBoxId}`,
          query: { q: 'success' }
        })
      }
    }
  })

  const isValidInputs =
    isSuccessSpace && address
      ? space?.admins.includes(address) && !!name && !!url
      : false

  const initialValues = {
    name: '',
    owner: '',
    image: '',
    url: '',
    description: ''
  }

  const validationSchemas = [
    Yup.object({
      name: Yup.string().max(40, 'Must be 40 characters max'),
      owner: Yup.string(),
      image: Yup.string(),
      url: Yup.string().matches(
        /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
        'Website should be a valid URL'
      ),
      description: Yup.string()
    })
  ]

  const formList = [
    <>
      <TextField
        maxLength={200}
        name="url"
        title="Website"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
      />
      <TextField name="name" title="Name" value={name} />
      <TextField name="owner" title="Owner" value={owner} />
      <TextField
        maxLength={200}
        name="image"
        title="Image Link"
        value={image}
      />
      <TextArea name="description" title="Description" value={description} />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null

  const handleSubmit = async (
    {}: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()

      if (signSuccess && address) {
        insertOneProjectMutation.mutate({
          owner,
          title: name,
          url,
          description,
          image,
          BudgetBoxes: [{ id: budgetBoxId }]
        })
        setIsModalOpen(true)
        setSubmitting(false)
      }
    } else {
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  useEffect(() => {
    if (isSuccessGiveth) {
      setname(givethData.title)
      setOwner(givethData.owner)
      setImage(givethData.image)
      setDescription(givethData.description.replace(/(<([^>]+)>)/gi, ''))
    }
  }, [givethData, isSuccessGiveth])

  return (
    <>
      <LoadingModal isOpen={isModalOpen} title="Creating Project" />
      <RegistrationLayout
        handleNavigation={handleNavigation}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        isValidInputs={isValidInputs}
        options={options}
        selected={selected}
        title="Import a project"
        validationSchemas={validationSchemas}
      >
        <CurrentForms index={selected} />
      </RegistrationLayout>
    </>
  )
}

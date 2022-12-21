import * as Yup from 'yup'
import { gql, GraphQLClient } from 'graphql-request'

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

const getQuery = (slug: string) => {
  return gql`
  {
    projectBySlug(slug: "${slug}") {
      slug
      title
      image
      description
      adminUser {
        name
      }
    }
  }
`
}

const graphQLClient = new GraphQLClient(
  'https://mainnet.serve.giveth.io/graphql'
)

export const ProjectImportView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [name, setname] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [url, setUrl] = useState<string>('')
  const router = useRouter()
  const budgetBoxId = router.query.budgetBoxId as string
  const spaceSlug = router.query.spaceSlug as string
  const { isModalOpen, setIsModalOpen } = useModal({})
  const { address, signIn } = useSiwe()

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
      <TextField name="name" title="Name" value={name} />
      <TextField name="owner" title="Owner" value={owner} />
      <TextField
        maxLength={200}
        name="image"
        title="Image Link"
        value={image}
      />
      <TextField
        maxLength={200}
        name="url"
        title="Website"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
        }}
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
    const fetchGivethProjects = async () => {
      const domain = url.match(/(?:[^:]+:\/\/)(?:www\.)*([.a-z0-9]+)+/)?.[1]
      const slug = url.match(/[^\/]+/g)?.pop()
      if (slug !== '' && domain === 'giveth.io') {
        const response = await graphQLClient.request(getQuery(slug || ''))
        const { title, adminUser, description, image } = response.projectBySlug
        setname(title)
        setOwner(adminUser.name)
        setImage(image)
        setDescription(description.replace(/(<([^>]+)>)/gi, ''))
      }
    }
    fetchGivethProjects().catch((e) => e)
  }, [url])

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

import { useState } from 'react'
import * as Yup from 'yup'
import { FormSelector } from '@/components/inputs/FormSelector'
import { TextArea } from '@/components/inputs//TextArea'
import { TextField } from '@/components/inputs/TextField'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
import type { FormikHelpers } from 'formik'

interface Values {
  creatorName: string
  ens: string
  adminAddresses: string
  spaceName: string
  spaceCategory: string
  spaceDescription: string
  spaceUrl: string
}

const options = ['Select addresses for Space', "Setup your Space's Profile"]

export const SpaceRegistrationView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [newSpaceSlug, setNewSpaceSlug] = useState<string>('')
  const { address, signIn } = useSiwe()

  const { data: ensNames, isSuccess: ensNamesSuccess } =
    trpc.ens.getEnsNamesByAddress.useQuery({
      address: address || ''
    })
  const ensNamesOptions = ensNamesSuccess ? ['', ...ensNames] : []

  const { refetch: refetchSpaceSlug } = trpc.space.getOneBySlug.useQuery({
    slug: newSpaceSlug
  })

  const insertOneSpaceMutation = trpc.space.insertOne.useMutation()
  const { data: categories } = trpc.category.getAll.useQuery()

  const categoryOptions = categories?.map(({ category }) => category) || []

  const initialValues = {
    creatorName: '',
    ens: '',
    adminAddresses: '',
    spaceName: '',
    spaceCategory: '',
    spaceDescription: '',
    spaceUrl: ''
  }

  const validationSchemas = [
    Yup.object({
      spaceName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceCategory: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      ens: Yup.string()
        .min(3, 'ENS name cannot be empty')
        .required('Required')
        .test('Unique ENS', 'Invalid ENS', (value: string | undefined) => {
          if (typeof ensNames === 'undefined' || !value) return true
          return ensNames.includes(value)
        })
        .test(
          'Unique ENS',
          'ENS already in use',
          async (value: string | undefined) => {
            if (!value) return false
            setNewSpaceSlug(value)
            const { data: space } = await refetchSpaceSlug()

            // If there is no space with the given slug the test will pass
            return !space
          }
        )
    }),
    Yup.object({
      creatorName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceDescription: Yup.string()
        .min(20, 'Must be 20 characters or more')
        .required('Required'),
      spaceUrl: Yup.string().matches(
        /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
        'Website should be a valid URL'
      ),
      adminAddresses: Yup.string().required('Required'),
      ens: Yup.string()
        .min(3, 'ENS name cannot be empty')
        .required('Required')
        .test('Unique ENS', 'Invalid ENS', (value: string | undefined) => {
          if (typeof ensNames === 'undefined' || !value) return true
          return ensNames.includes(value)
        })
        .test(
          'Unique ENS',
          'ENS already in use',
          async (value: string | undefined) => {
            if (!value) return false
            setNewSpaceSlug(value)
            const { data: space } = await refetchSpaceSlug()

            // If there is no space with the given slug the test will pass
            return !space
          }
        )
    })
  ]

  const formList = [
    <>
      <TextField name="spaceName" title="Name" />
      <FormSelector
        name="ens"
        options={ensNamesOptions}
        title="ENS for the space"
      />
      <FormSelector
        name="spaceCategory"
        options={categoryOptions}
        title="Category"
      />
    </>,
    <>
      <TextField name="creatorName" title="Space creator name" />
      <TextField name="spaceUrl" title="Website" />
      <TextArea name="spaceDescription" title="Description" />
      <TextArea
        name="adminAddresses"
        title="Set up admin accounts for your space (add comma separated addresses)"
      />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()
      if (signSuccess && address) {
        insertOneSpaceMutation.mutate({
          admins: values.adminAddresses.split(','),
          categoryName: values.spaceCategory,
          creator: values.creatorName,
          description: values.spaceDescription,
          image:
            'https://user-images.githubusercontent.com/18421017/206027384-4869ad77-e635-4525-a5e8-e88eb8a5b206.png',
          slug: values.ens,
          title: values.spaceName,
          url: values.spaceUrl
        })
        setSubmitting(false)
      }
    } else {
      setSubmitting(false)
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  return (
    <RegistrationLayout
      handleNavigation={handleNavigation}
      handleSubmit={handleSubmit}
      initialValues={initialValues}
      options={options}
      selected={selected}
      title="Create your space"
      validationSchemas={validationSchemas}
    >
      <CurrentForms index={selected} />
    </RegistrationLayout>
  )
}

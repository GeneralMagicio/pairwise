import { useState } from 'react'
import * as Yup from 'yup'
import { useAccount } from 'wagmi'
import { FormSelector } from '@/components/inputs/FormSelector'
import { TextArea } from '@/components/inputs//TextArea'
import { TextField } from '@/components/inputs/TextField'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import type { FormikHelpers } from 'formik'

interface Values {
  creatorName: string
  creatorAddress: string
  adminAddresses: string
  spaceName: string
  spaceSlug: string
  spaceCategory: string
  spaceDescription: string
  spaceUrl: string
}

const options = ['Select addresses for Space', "Setup your Space's Profile"]

export const SpaceRegistrationView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [newSpaceSlug, setNewSpaceSlug] = useState<string>('')
  const { address } = useAccount()

  const { refetch: refetchSpaceSlug } = trpc.space.getOneBySlug.useQuery({
    slug: newSpaceSlug
  })
  const { refetch: refetchSpaceAddress } = trpc.space.getOneByAddress.useQuery({
    address: address || ''
  })
  const insertOneSpaceMutation = trpc.space.insertOne.useMutation()
  const { data: categories } = trpc.categoryRouter.getAll.useQuery()

  const categoryOptions = categories?.map(({ category }) => category) || []

  const initialValues = {
    creatorName: '',
    creatorAddress: address || '',
    adminAddresses: '',
    spaceName: '',
    spaceSlug: '',
    spaceCategory: '',
    spaceDescription: '',
    spaceUrl: ''
  }

  const validationSchemas = [
    Yup.object({
      creatorName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      creatorAddress: Yup.string()
        .min(42, 'Must be a valid address')
        .required('Required')
        .test(
          'Unique Address',
          'There is already a space with this address',
          async (value: string | undefined) => {
            if (!value) return true
            const { data: space } = await refetchSpaceAddress()

            // If there is no space with the given address the test will pass
            return !space
          }
        ),
      adminAddresses: Yup.string().required('Required')
    }),
    Yup.object({
      spaceName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceSlug: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required')
        .test(
          'Unique slug',
          'Slug already in use',
          async (value: string | undefined) => {
            if (!value) return false
            setNewSpaceSlug(value)
            const { data: space } = await refetchSpaceSlug()

            // If there is no space with the given slug the test will pass
            return !space
          }
        ),
      spaceCategory: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceDescription: Yup.string()
        .min(20, 'Must be 15 characters or less')
        .required('Required'),
      spaceUrl: Yup.string()
        .matches(
          /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
          'Website should be a valid URL'
        )
        .required('Required')
    })
  ]

  const formList = [
    <>
      <TextField name="creatorName" title="Space creator name" />
      <TextField
        disabled={true}
        maxLength={42}
        name="creatorAddress"
        title="Wallets adress for the space"
        value={address}
      />
      <TextArea
        name="adminAddresses"
        title="Set up admin accounts for your space (add comma separated addresses)"
      />
    </>,
    <>
      <TextField name="spaceName" title="Name" />
      <TextField name="spaceSlug" title="Slug" />
      <FormSelector
        name="spaceCategory"
        options={categoryOptions}
        title="Category"
      />
      <TextArea name="spaceDescription" title="Description" />
      <TextField name="spaceUrl" title="Website" />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null

  const handleSubmit = (
    values: Values,
    { setSubmitting, setTouched }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      insertOneSpaceMutation.mutate({
        address: values.creatorAddress,
        admins: values.adminAddresses.split(','),
        categoryName: values.spaceCategory,
        creator: values.creatorName,
        description: values.spaceDescription,
        image:
          'https://user-images.githubusercontent.com/18421017/206027384-4869ad77-e635-4525-a5e8-e88eb8a5b206.png',
        slug: values.spaceSlug,

        title: values.spaceName,
        url: values.spaceUrl
      })
      setSubmitting(false)
    } else {
      setTouched({})
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

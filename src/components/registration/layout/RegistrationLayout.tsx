import classNames from 'classnames'
import { Formik, Form } from 'formik'
import { RegistrationMain } from '@/components/registration/layout/RegistrationMain'
import { RegistrationSidebar } from '@/components/registration/layout/RegistrationSidebar'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import type * as Yup from 'yup'
import type { ReactElement } from 'react'
import type { FormikHelpers } from 'formik'

interface IRegistrationLayout<Values> {
  children: ReactElement
  options: Array<string>
  selected: number
  title: string
  handleNavigation: (indexChange: number) => void
  handleSubmit: (values: Values, helpers: FormikHelpers<Values>) => void
  initialValues: Values
  validationSchemas: Array<Yup.AnySchema>
}

export const RegistrationLayout = <Values extends object>({
  children,
  options,
  selected,
  title,
  handleNavigation,
  handleSubmit,
  initialValues,
  validationSchemas
}: IRegistrationLayout<Values>) => {
  const validationSchema = validationSchemas[selected]
  const isLastPage = selected === options.length - 1

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-6">
      <div className="col-span-1">
        <RegistrationSidebar options={options} selected={selected} />
      </div>
      <div className="col-span-3">
        <RegistrationMain title={title}>
          <Formik
            initialValues={initialValues}
            validateOnBlur={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                {children}
                <div className="mt-10 flex justify-between">
                  <PrimaryButton
                    color={ButtonColors.BLUE_GRADIENT}
                    fontStyles="font-medium"
                    label="Previous"
                    styles={classNames(
                      'w-32 h-12',
                      selected === 0 ? 'invisible' : ''
                    )}
                    onClick={() => handleNavigation(-1)}
                  />
                  <PrimaryButton
                    color={ButtonColors.BLUE_GRADIENT}
                    disabled={!isValid || (isLastPage && isSubmitting)}
                    fontStyles="font-medium"
                    styles="w-32 h-12"
                    type={'submit'}
                    label={
                      isSubmitting ? (
                        <LoadingIcon />
                      ) : isLastPage ? (
                        'Register'
                      ) : (
                        'Next'
                      )
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </RegistrationMain>
      </div>
    </div>
  )
}

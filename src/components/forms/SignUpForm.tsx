import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { signUp } from '../../services/auth'
import { AuthFormData } from '../../types'
import { CircularProgress, PrimaryButton } from '../ui'
import { TextInput } from './inputs/TextInput'

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AuthFormData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const navigate = useNavigate()

  // Get the previous user's location to redirect them after login
  const location = useLocation(),
    locationState = location.state as { from: Location },
    from = locationState?.from?.pathname || '/'

  const onSubmit = async (data: AuthFormData) => {
    setErrorMessage('')
    const signInResponse = await signUp(data.email, data.password)
    if ('data' in signInResponse) {
      const { data } = signInResponse
      if ('id' in data) {
        navigate(from, { replace: true })
      } else if ('message' in data) {
        setErrorMessage(data.message)
      }
    }
    if ('message' in signInResponse) setErrorMessage(signInResponse.message)
  }

  return (
    <form
      className="w-full justify-center items-center flex flex-col space-y-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        id="signup-email"
        label="E-mail"
        register={register('email', { required: true })}
      />
      <TextInput
        id="signup-password"
        label="Password"
        register={register('password', { required: true })}
        type="password"
      />
      <PrimaryButton content="create account" disabled={isSubmitting} />
      <div className="h-5 flex justify-center">
        {errorMessage ? errorMessage : isSubmitting ? <CircularProgress /> : <></>}
      </div>
    </form>
  )
}

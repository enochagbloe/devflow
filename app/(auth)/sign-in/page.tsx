"use client"

import AuthForm from '@/components/forms/AuthForms'
import { SignInSchema } from '@/lib/validation'
import React from 'react'

const SignIn = () => {
  return (
    <div>
      <AuthForm
      FormType = "SIGN_IN"
      schema = {SignInSchema}
      defaultValues = {{email: '', password: ''}}
      onsubmit = {(data) => Promise.resolve({success: true, data})}
      />
    </div>
  )
}

export default SignIn
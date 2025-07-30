"use client";

import React from "react";
import AuthForm from "@/components/forms/AuthForms";
import { SignUpSchema } from "@/lib/validation";
import { signUpWithCredentials } from "@/lib/actions/auth.action";

// This is the SignUp component that renders the sign-up form
// It uses the AuthForm component and passes the necessary props
// such as the form type, validation schema, default values, and submit handler
const SignUp = () => {
  return (
    <div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", password: "", name: "", username: "" }}
        onSubmit={signUpWithCredentials}
      />
    </div>
  );
};

export default SignUp;
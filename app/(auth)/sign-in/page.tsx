"use client";

import AuthForm from "@/components/forms/AuthForms";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validation";
import React from "react";

const SignIn = () => {
  return (
    <div>
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={signInWithCredentials}
      />
    </div>
  );
};

export default SignIn;

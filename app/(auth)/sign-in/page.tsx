"use client";

import AuthForm from "@/components/forms/AuthForms";
import { SignInSchema } from "@/lib/validation";
import React from "react";

const SignIn = () => {
  return (
    <div>
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
};

export default SignIn;

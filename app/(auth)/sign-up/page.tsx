"use client";

import React from "react";
import AuthForm from "@/components/forms/AuthForms";
import { SignUpSchema } from "@/lib/validation";
const SignUp = () => {
  return (
    <div>
      <AuthForm
        FormType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", password: "", name: "", username: "" }}
        onsubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
};

export default SignUp;

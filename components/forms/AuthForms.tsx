"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  useForm,
  DefaultValues,
  SubmitHandler,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ROUTES from "@/constants/routes";


interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  FormType: "SIGN_IN" | "SIGN_UP";
  defaultValues: DefaultValues<T>;
  onsubmit: (data: T) => Promise<{ success: boolean; data: T }>;
}

const AuthForm = <T extends FieldValues>({
  schema,
  FormType,
  defaultValues,
  onsubmit,
}: AuthFormProps<T>) => {
  // 1. Define your form.
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 2. Define your onSubmit function.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const response = await onsubmit(data);
    if (response.success) {
      console.log("Form submitted successfully:", response.data);
    } else {
      console.error("Form submission failed:", response.data);
    }
  };

  // 3. Render the form.
  const buttonText = FormType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((fieldName) => (
          <FormField
            key={fieldName}
            name={fieldName as unknown as import("react-hook-form").Path<T>}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark300_light700">
                  {fieldName === "email"
                    ? "Email Address"
                    : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={fieldName === "password" ? "password" : "text"}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-w-32 rounded-md border focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium my-12 w-full rounded-2 px-3 py-4 font-inter !text-light-900 "
          type="submit"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "SigningIn...."
              : "Sign Up"
            : buttonText}
        </Button>
        {FormType === "SIGN_IN" ? (
          <p> {" "}
            Don&#39;t have an account {""} <Link 
            className = "primary-text-gradient paragraph-semibold"
            href={ROUTES.SIGN_UP}> Sign up</Link>{" "}
          </p>
        ) : (
          <p>
            {" "}
            Already have account {""} <Link 
            className = "primary-text-gradient paragraph-semibold"
            href={ROUTES.SIGN_IN}> Sign in</Link>{" "}
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ActionResponse } from "@/types/global";
import { AnswerSchema } from "@/lib/validation";
import { useRef, useState } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
// interface AuthFormProps<T extends FieldValues> {
//   schema: ZodType<T>;
//   defaultValues: T;
//   onSubmit: (data: T) => Promise<ActionResponse>;
//   formType: "SIGN_IN" | "SIGN_UP";
// }
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const AnswerForm = () => {
  const Ref = useRef<MDXEditorMethods>(null);
  // for submitting the form
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ai submitting the form
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: " ",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    // You need to implement this function or receive onSubmit as a prop
    // const result = (await onSubmit(data)) as ActionResponse;
    console.log(values);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold"> Write your answer here </h4>
          <Button
            className="btn light-border-2"
            disabled={isSubmitting}
          >
            {isAiSubmitting ? (
              <>
                <LoaderIcon className="animate-spin mr-2 size-4" />
                Generating...
              </>
            ) : (
              <>
                <Image
                  src="/icons/stars.svg"
                  alt="AI Generating Answer"
                  width={12}
                  height={12}
                  className="object-contain"
                />
                <span className="text-primary-500">Generate with AI</span>
              </>
            )}
          </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-10 space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            defaultValue={form.getValues("content")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    editorRef={Ref}
                    value={field.value}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="primary-gradient"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="animate-spin mr-2 size-4" />
                  posting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;

"use client";
import { AskQuestionShema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
const QuestionForm = () => {
  // use ref for the Editor
  const Ref = useRef<MDXEditorMethods>(null);
  // specify the question form validation here
  const form = useForm({
    resolver: zodResolver(AskQuestionShema),
    defaultValues: {
      content: "",
      title: "",
      tags: [],
    },
  });

  // event handler
  const handleCreateQuestion = (data: any) => {
    // To do
  };

  return (
    //validate the form
    <Form {...form}>
      <form
        className="w-full flex-col gap-10 pb-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        {/* contains the form fields */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark300_light700">
                Questions title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-md border focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-2.5 pb-5">
                {" "}
                please be specific in your question
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark300_light700">
                Detailed explanation of your question{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={Ref}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="mt-2.5 pb-5">
                {" "}
                please be specific in your question
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark300_light700">
                Questions title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  {" "}
                  <div>
                    <Input
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-md border focus:outline-none"
                      {...field}
                      placeholder="Add tags..."
                    />
                    Tags
                  </div>
                </div>
              </FormControl>
              <FormDescription> </FormDescription>
              Add up to 3 tags
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="m-t-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient ft justify-end !text-white-900"
          >
            Ask question
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;

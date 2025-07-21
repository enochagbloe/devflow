"use client";
import { AskQuestionShema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {  useRef, useTransition } from "react";
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
import { z } from "zod";
import { LoaderIcon } from "lucide-react";
import TagCard from "../card/TagCard";
import { createQuestion } from "@/lib/actions/question.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";


const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});


const QuestionForm = () => {
  const Router = useRouter();
  const [isPending, startTransition] = useTransition();
  // use ref for the Editor
  const Ref = useRef<MDXEditorMethods>(null);
  // specify the question form validation here
  const form = useForm<z.infer<typeof AskQuestionShema>>({
    resolver: zodResolver(AskQuestionShema),
    defaultValues: {
      content: "",
      title: "",
      tags: [],
    },
  });

  // handle input key down for tags
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    // what happens when thee input key is pressed
    if (e.key === "Enter") {
      e.preventDefault();
      // get the input value and trim it
      const inputTag = e.currentTarget.value.trim();

      // check if the input tag is not empty, does not exceed 15 characters, and is not already in the field value
      if (
        inputTag &&
        inputTag.length <= 15 &&
        !field.value.includes(inputTag)
      ) {
        form.setValue("tags", [...field.value, inputTag]);
        form.clearErrors("tags");
        e.currentTarget.value = "";
      } else if (inputTag.length > 15) {
        alert("Tag cannot exceed 15 characters.");
        form.setError("tags", {
          type: "manual",
          message: "Tag cannot exceed 15 characters.",
        });
        // Tag already exists
      } else if (field.value.includes(inputTag)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
      }
      e.currentTarget.value = "";
    }
    // log the current tags and input tag
    console.log("Current Tags:", field.value);
  };

  const removeTags = (tag: string, field: { value: string[] }) => {
    const removeTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", removeTags);
  };
  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionShema>
  ) => {
    startTransition(async () => {
      const result = await createQuestion(data);
      // notify the user if the user has successfully created a question
      if (result.success) {
        toast.success("Question created successfully!");

        // redirect to the question page if the question is created successfully
      if (result.data) Router.push(ROUTES.QUESTION(result.data?._id));
      }
      else {
        toast.error("Failed to create question");
      }
      console.log("Form Data:", data);
    });
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
                      placeholder="Add tags..."
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start gap-3 mt-3.4 flex-wrap">
                        {field?.value?.map((tag: string) => (
                          <TagCard
                            _id={tag}
                            key={tag}
                            name={tag}
                            compact
                            isButton
                            remove
                            handleRemove={(e) => removeTags(tag, field)}
                          />
                        ))}
                      </div>
                    )}
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
            disabled={isPending}
            className="primary-gradient justify-end !text-white-900"
          >
            {isPending ? (
              <>
                <LoaderIcon className="mr-2 animate-spin" />
                <span>submitting</span>
              </>
            ) : (
              <>AskQuestion</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;

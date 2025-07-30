"use client";
import { AskQuestionShema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useTransition } from "react";
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
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { Question } from "@/types/global";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Params {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
  const Router = useRouter();
  const [isPending, startTransition] = useTransition();
  // use ref for the Editor
  const Ref = useRef<MDXEditorMethods>(null);

  // specify the question form validation here
  const form = useForm<z.infer<typeof AskQuestionShema>>({
    resolver: zodResolver(AskQuestionShema),
    defaultValues: {
      // set the default values
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags?.map((tag) => tag.name) || [],
    },
  });

  // handle input key down for tags
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    // what happens when the input key is pressed
    if (e.key === "Enter") {
      e.preventDefault();
      // get the input value and trim it
      const inputTag = e.currentTarget.value.trim();

      // check if the input tag is not empty, does not exceed 15 characters, and is not already in the field value
      if (
        inputTag &&
        inputTag.length <= 15 &&
        !field.value.some((tag) => tag.toLowerCase() === inputTag.toLowerCase())
      ) {
        form.setValue("tags", [...field.value, inputTag]);
        form.clearErrors("tags");
        e.currentTarget.value = "";
      } else if (inputTag.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag cannot exceed 15 characters.",
        });
      } else if (
        field.value.some((tag) => tag.toLowerCase() === inputTag.toLowerCase())
      ) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
      }

      // Clear input if there's an error
      if (
        inputTag.length > 15 ||
        field.value.some((tag) => tag.toLowerCase() === inputTag.toLowerCase())
      ) {
        e.currentTarget.value = "";
      }
    }
  };

  const removeTags = (tag: string, field: { value: string[] }) => {
    const removeTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", removeTags);
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionShema>
  ) => {
    startTransition(async () => {
      if (isEdit && question && question._id) {
        const result = await editQuestion({
          questionId: question?._id,
          ...data,
        });

        if (result.success) {
          toast.success("Question updated successfully!");
          // Type assertion as temporary fix
          if (result.data && "_id" in result.data) {
            Router.push(ROUTES.QUESTION((result.data as any)._id));
          }
        } else {
          toast.error("Failed to update question");
        }

        return;
      }

      const result = await createQuestion(data);
      // redirect the user if the user has successfully created a question
      if (result.success) {
        toast.success("Question created successfully!");
        // redirect to the question page if the question is created successfully
        // Type assertion as temporary fix
       if (result.data && "_id" in result.data) {
            Router.push(ROUTES.QUESTION((result.data as any)._id));
          }
      } else {
        toast.error("Failed to create question");
      }
    });
  };

  return (
    //validate the form
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-10 pb-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        {/* contains the form fields */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark300_light700">
                Question title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-md border focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-2.5 pb-5">
                Please be specific in your question
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
                Please provide a detailed explanation of your question
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
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-md border focus:outline-none"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex flex-start gap-3 mt-3 flex-wrap">
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
              </FormControl>
              <FormDescription>Add up to 3 tags</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient justify-end !text-white-900"
          >
            {isPending ? (
              <>
                <LoaderIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{isEdit ? "Edit Question" : "Ask a Question"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;

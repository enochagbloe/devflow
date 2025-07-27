import React from "react";
import QuestionForm from "@/components/forms/QuestionForm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { RouteParams } from "@/types/global";
import { getQuestion } from "@/lib/actions/question.action";
import ROUTES from "@/constants/routes";



const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect("/sign-in");

  //fetch the question data
  const response = await getQuestion({ questionId: id });
  const { data: question, success } = response as any
  if (!success) return notFound();

  if (question.author.toString() !== session?.user?.id)
    return redirect(ROUTES.QUESTION(id));
  return (
    <main>
        {/* ask yourself this question is the form be able to edit if yes*/}
      <QuestionForm question={question} isEdit/>
    </main>
  );
};

export default EditQuestion;

// write  your validation in the validation form

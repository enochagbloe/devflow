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
  console.log("🔍 About to call getQuestion...");
  const response = await getQuestion({ questionId: id });
  console.log("🔍 getQuestion response:", response);

  const { data: question, success } = response as any;
  if (!success) {
    console.log("❌ getQuestion failed, returning notFound");
    return notFound();
  }

  console.log("🔍 Question data:", question);
  console.log("🔍 Question author (raw):", question.author);
  console.log("🔍 Session user ID:", session?.user?.id);

  // For now, let's compare the author ID directly (since we're not populating)
  if (question.author?.toString() !== session?.user?.id?.toString()) {
    console.log("❌ Author mismatch, redirecting...");
    return redirect(ROUTES.QUESTION(id));
  }
  return (
    <main>
      {/* ask yourself this question is the form be able to edit if yes*/}
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;

// write  your validation in the validation form

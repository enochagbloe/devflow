import React from "react";
import QuestionForm from "@/components/forms/QuestionForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const AskQuestion = async () => {
  // Check if the user is authenticated
  // If not authenticated, redirect to the login page
  const session = await auth()
  if(!session) return redirect("/sign-in");
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9 "> 
        <QuestionForm/>
      </div>
    </>
  );
};

export default AskQuestion;

// write  your validation in the validation form

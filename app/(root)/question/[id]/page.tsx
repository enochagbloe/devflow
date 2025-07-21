import { RouteParams } from "@/types/global";
import React from "react";

const QuestionDetails = async ({ params }: RouteParams) => {
  // destructure the params
  const { id } = await params;
  return <div>QuestionPage: {id}</div>;
};

export default QuestionDetails;

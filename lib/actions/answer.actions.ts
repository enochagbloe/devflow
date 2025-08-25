"use server";

import { CreateAnswerParams, GetAllAnswersParams } from "@/types/action";
import { AnswerServerSchema, GetAllAnswerSchema } from "../validation";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handler/action";
import handleError from "../handler/error";
import mongoose, { SortOrder } from "mongoose";
import Answer from "@/database/answer.model";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { IAnswerDoc } from "@/database/answer.model";

// function to create an answer to the question
export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  // Validate the input
  const validationResult = await action({
    schema: AnswerServerSchema,
    params,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // destructure the data
  const { content, questionId } = validationResult.params!;
  // check this later
  const userId = validationResult.session?.user?.id;

  // set mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if the question exists
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");
    // create the answer
    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    if (!newAnswer) throw new Error("Failed to create answer");
    // update the question with the new answer
    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    //revalidate the route
    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const getAllAnswers = async (
  params: GetAllAnswersParams
): Promise<
  ActionResponse<{
    answers: IAnswerDoc[];
    isNext: boolean;
    totalAnswers: number;
  }>
> => {
  const validationResult = await action({
    params,
    schema: GetAllAnswerSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = params;

  // implementing the pagination by implementing the number we want to skip
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const answers = await Answer.find({ question: questionId })
      .populate("author", "name _id image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers,
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

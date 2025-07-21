// a server action which will be responsible or creating a question
"use server";

import { AskQuestionShema } from "../validation";
import action from "../handler/action";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { ActionResponse, Question as QuestionType } from "@/types/global";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import handleError from "../handler/error";

// this have to handle different input such as title, tags, content, etc.
export async function createQuestion(
  params: CreateQuestionParams
): // returning a promise of ActionResponse with the question type
Promise<ActionResponse<QuestionType>> {
  //validate the inputs we have here
  // This means only authorizes users can create a question

  const validationResult = await action({
    params,
    schema: AskQuestionShema,
    authorize: true,
  });
  // if the validation fails, it will return an error response
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  //set your question params
  const { title, tags, content } = validationResult.params!;
  // get the userId from the session
  const userId = validationResult.session?.user?.id;

  // if the validation passes, we can proceed with creating the question with MongoDB

  // start session from mongoose
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create a question
    const [question] = await Question.create(
      [{ title, content, author: userId, tags }],
      { session }
    );
    // if the question error, we will throw an error
    if (!question) {
      throw new Error("Failed to create question");
    }
    // Get access to tag id
    const tagIds: mongoose.Types.ObjectId[] = [];
    // create a tag question documents
    const tagQuestionDocuments = [];

    // loop through the tags and create a tag question document
    for (const tag of tags) {
      // get a tag from the database
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // update the question with the tag ids
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { tags: tagIds } } },
      { session }
    );
    // commit the transaction
    await session.commitTransaction();

    // return a success response
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

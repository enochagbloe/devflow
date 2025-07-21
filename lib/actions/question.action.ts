// a server action which will be responsible or creating a question
"use server";

import { AskQuestionShema } from "../validation";
import action from "../handler/action";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { ActionResponse } from "@/types/global";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import handleError from "../handler/error";

// this have to handle different input such as title, tags, content, etc.
export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<typeof Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionShema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, tags, content } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // STEP 1: First, process the tags and get their ObjectIds
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag._id);
    }

    // STEP 2: Create the question with ObjectIds instead of strings
    const [question] = await Question.create(
      [{ 
        title, 
        content, 
        author: userId, 
        tags: tagIds // ✅ Use ObjectIds here, not the original string tags
      }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    // STEP 3: Create tag-question relationship documents
    for (const tagId of tagIds) {
      tagQuestionDocuments.push({
        tags: tagId,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // STEP 4: No need to update the question again since we already set the tags
    // The question already has the correct tag ObjectIds

    await session.commitTransaction();

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
// Edit question action to update the question 
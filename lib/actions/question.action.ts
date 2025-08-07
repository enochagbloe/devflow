// a server action which will be responsible or creating a question
"use server";

import {
  AskQuestionShema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validation";
import action from "../handler/action";
import mongoose, { FilterQuery } from "mongoose";
// Import models from centralized database index to ensure they're all registered
import { Question, Tag, TagQuestion, User } from "@/database";
import { IQuestionDoc } from "@/database/question.model";
import {
  ActionResponse,
  ErrorResponse,
  PaginationSearchParams,
} from "@/types/global";
import handleError from "../handler/error";
import { ITagDoc } from "@/database/tag.model";
import { PaginationSearchParamsSchema } from "../validation";
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionParams,
  incrementViewsParams,
} from "@/types/action";
("/");
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
      [
        {
          title,
          content,
          author: userId,
          tags: tagIds, // ✅ Use ObjectIds here, not the original string tags
        },
      ],
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
export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
  // validate the data
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  // handle the validation data
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, title, tags, content } = validationResult.params!; // ✅ Added questionId
  // get the userId
  const userId = validationResult.session?.user?.id;

  // start a mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // get access to the question
    const question = await Question.findById(questionId).populate("tags");

    if (!question) throw new Error("Question not found");
    if (question.author.toString() !== userId)
      throw new Error("You're not authorized to edit this question");

    // check for which field has been updated
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // ✅ Fixed variable name from Tags to tags (lowercase)
    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some(
          (existingTag: ITagDoc) =>
            existingTag.name.toLowerCase() === tag.toLowerCase()
        )
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some((newTag) => newTag.toLowerCase() === tag.name.toLowerCase())
    );

    const newTagDocuments = []; // ✅ Fixed variable name from newDocument

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );
        if (existingTag) {
          newTagDocuments.push({
            tags: existingTag._id, // ✅ Keep 'tags' if that's what your schema expects
            question: question._id,
          });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      // ✅ Fixed field name - use 'tags' instead of 'tag' to match your schema
      await TagQuestion.deleteMany(
        { tags: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );

      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((removeId: mongoose.Types.ObjectId) =>
            removeId.equals(tagId)
          )
      );
    }

    // ✅ Fixed variable name from newTagDocument to newTagDocuments
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// this function gets the question to edit and to view it details page of that questions found on the home page
export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<typeof Question>> {
  console.log("🔍 getQuestion called with params:", params);

  // validate the data
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: false,
  });

  console.log("🔍 Validation result:", validationResult);

  // handle the validation data
  if (validationResult instanceof Error) {
    console.log("❌ Validation failed:", validationResult.message);
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  console.log("🔍 Looking for question with ID:", questionId);

  try {
    console.log("🔍 About to query database...");

    // Try without populate first to test basic functionality
    const question = await Question.findById(questionId)
      .populate("tags", "_id name")
      .populate("author", "_id name image");
    // console.log(
    //   "🔍 Simple query completed. Found question:",
    //   question ? "Yes" : "No"
    // );

    if (!question) throw new Error("Question not found");

    console.log("🔍 Question title:", question.title);
    console.log("🔍 Question author ID (raw):", question.author);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    console.log("❌ Error in getQuestion:", error);
    return handleError(error) as ErrorResponse;
  }
}

// this function will be used to get all questions on the home page
export async function getQuestions(
  params: PaginationSearchParams
): Promise<ActionResponse<{ questions: IQuestionDoc[]; isNext: boolean }>> {
  // validate the data
  const validationResult = await action({
    params,
    schema: PaginationSearchParamsSchema,
  });

  // handle the validation data
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query = "",
    filter = "",
    sort = "",
  } = validationResult.params!;
  // set the skip value
  const skip = (Number(page) - 1) * Number(pageSize);
  // set the limit
  const limit = Number(pageSize);

  // define the filters (found on the frontend)
  const filterQuery: FilterQuery<typeof Question> = {};
  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }
  // check if we have acces to the query
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
      { tags: { $elemMatch: { name: { $regex: new RegExp(query, "i") } } } },
    ];
  }
  // sort criteria on the frontend
  let sortCriteria = {}; // why let so that it can be modified later
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular": {
      sortCriteria = { upvotes: -1 };
    }
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    // check how many questions are there
    const totalQuestions = await Question.countDocuments(filterQuery);
    // fetch the questions based on the filter, query, and sort criteria
    const questions = await Question.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("tags", "_id name")
      .populate("author", "_id name image");

    // check if the next page exists
    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

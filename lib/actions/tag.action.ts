import {
  ActionResponse,
  PaginationSearchParams,
  Question as QuestionType,
  Tag as TagType,
} from "@/types/global";
import {
  GetTagQuestionsSchema,
  PaginationSearchParamsSchema,
} from "../validation";
import action from "../handler/action";
import handleError from "../handler/error";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import { ErrorResponse, GetTagQuestionsParams } from "@/types/action";
import { Question } from "@/database";

export const getTags = async (
  params: PaginationSearchParams
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean }>> => {
  // validate the params we are passing in
  const validationResult = await action({
    params,
    schema: PaginationSearchParamsSchema,
  });

  // handle data validation error
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // destructure the params
  const {
    page = 1,
    pageSize = 10,
    query = "",
    sort = "",
    filter = "",
  } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  // set the limit
  const limit = Number(pageSize);

  // create a filter query
  const filteredQuery: FilterQuery<typeof Tag> = {};

  // check if there is a specific Query
  if (query) {
    filteredQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } }, // Search by tag name
      //   { description: { $regex: new RegExp(query, "i") } }, // Search by tag description
    ];
  }

  // set your SortCriteria found on the top in the frontend
  let sortCriteria = {};
  // use switch case statement
  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = {}; // Default sort criteria
      break;
  }

  // try and catch block to fetch the data
  try {
    // fetch the total number of tags we have
    const totalTags = await Tag.countDocuments(filteredQuery);
    // fetch the tags based on the filter, sort and pagination
    // we are using the skip and limit to paginate the data
    const tags = await Tag.find(filteredQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    // check if we have any tags left on the page
    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// Make a call to the Question model to get the questions based on the tag
export const getTagQuestions = async (
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{ tag: TagType; questions: QuestionType[]; isNext: boolean }>
> => {
  // validate the params we are passing in
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  // handle data validation error
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // destructure the params
  const {
    page = 1,
    pageSize = 10,
    query = "",
    tagId = "",
  } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  // set the limit
  const limit = Number(pageSize);

  // try and catch block to fetch the data
  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    // create a filter query
    const filteredQuery: FilterQuery<typeof Question> = {
      tags: { $in: [tagId] }, // Filter by the specific tag ID
    };

    // check if there is a specific Query
    if (query) {
      filteredQuery.title = { $regex: new RegExp(query, "i") }; // Search by title
    }

    // fetch the total number of tags we have in the question database
    const totalQuestions = await Question.countDocuments(filteredQuery);
    // fetch the tags based on the filter, sort and pagination
    // we are using the skip and limit to paginate the data
    const question = await Question.find(filteredQuery)
      .select(
        "id title author tags views upvotes downvotes answers createdAt"
      )
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" }]
      )
      .skip(skip)
      .limit(limit);
    // check if we have any tags left on the page
    const isNext = totalQuestions > skip + question.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(question)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

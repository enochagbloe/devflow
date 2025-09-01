"use server";
import {
  createVoteParams,
  ErrorResponse,
  HasVotedResponse,
  HasVoteParams,
  updateVoteCountParams,
} from "@/types/action";
import action from "../handler/action";
import {
  createVoteSchema,
  hasVotedSchema,
  updateVoteCountSchema,
} from "../validation";
import handleError from "../handler/error";
import { ActionResponse } from "@/types/global";
import mongoose from "../mongoose";
import { Answer, Question, Vote } from "@/database";
import { ClientSession } from "mongoose";

export const updateVoteCountAction = async (
  params: updateVoteCountParams,
  session: ClientSession
): Promise<ActionResponse> => {
  // implementation for voting
  // validation the votes
  const validationResult = await action({
    params,
    schema: updateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { change, voteType, targetId, targetType } = validationResult.params!;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findOneAndUpdate(
      { _id: targetId },
      { $inc: { [voteField]: change } },
      { new: true, session }
    );

    if (!result) {
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;
    }

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const CreateVoteAction = async (
  params: createVoteParams,
  parentSession: ClientSession
): Promise<ActionResponse> => {
  // implementation for voting
  // validation the votes
  const validationResult = await action({
    params,
    schema: createVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // extract the params from the createVoteParams from the validationResult
  const { voteType, targetId, targetType } = validationResult.params!;

  // get the user from the validationResult
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  // create a new mongoose session to modify the votes
  const mongooseInstance = await mongoose();
  const session = await mongooseInstance.startSession();
  session.startTransaction();

  try {
    // perform the voting logic here
    // Find an exiting vote
    const existingVote = await Vote.findOne(
      {
        author: userId,
        actionId: targetId,
        actionType: targetType,
      },
      { session }
    );

    if (existingVote) {
      if (existingVote === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }, { session });
        // update the vote count
        await updateVoteCountAction(
          {
            change: -1,
            voteType,
            targetId,
            targetType,
          },
          session
        );
      } else {
        // If the user already voted with a different voteType, update the vote
        await Vote.findOneAndUpdate(
          { _id: existingVote._id },
          { voteType },
          { session }
        );

        await updateVoteCountAction(
          {
            change: 1,
            voteType,
            targetId,
            targetType,
          },
          session
        );
      }
    } else {
      // create a new vote
      await Vote.create(
        {
          author: userId,
          actionId: targetId,
          actionType: targetType,
          voteType,
        },
        { session }
      );
      await updateVoteCountAction(
        {
          change: 1,
          voteType,
          targetId,
          targetType,
        },
        session
      );
    }
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const HasVotedAction = async (
  params: HasVoteParams
): Promise<ActionResponse<HasVotedResponse>> => {
  const validatedResults = await action({
    params,
    schema: hasVotedSchema,
    authorize: true,
  });
  if (validatedResults instanceof Error) {
    return handleError(validatedResults) as ErrorResponse;
  }
  // extract the data from the validatedResults
  const { targetId, targetType } = validatedResults.params!;
  //check if the user is logged in
  const userId = validatedResults.session?.user?.id;

  try {
    //get access to the votes
    const vote = await Vote.findOne({
      actionId: targetId,
      actionType: targetType,
      author: userId,
    });
    if (!vote) {
      return {
        success: true,
        data: { hasUpVoted: false, hasDownvoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasUpVoted: vote.voteType === "up",
        hasDownvoted: vote.voteType === "down",
      },
    };
    
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

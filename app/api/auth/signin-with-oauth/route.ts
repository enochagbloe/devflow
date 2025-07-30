import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { signInWithOAuthSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  // extract the from the json the params needed
  const { provider, providerAccountId, user } = await request.json();

  // connect to the database
  await dbConnect();

  // create mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // for debugging purpose
    // const body = await request.json();
    // console.log("Request body:", body);

    // validate the data
    const validationData = signInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    // if the data is not valid
    if (!validationData.success)
      throw new ValidationError(validationData.error.flatten().fieldErrors);

    // destruct the value about a user
    const { name, email, username, image } = user;

    // slugify the username
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    //check if a user already exist
    let existingUser = await User.findOne({ email }).session(session);
    // check if there is no existing user
    if (!existingUser) {
      // create a new user
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session }
      );
    } else {
      // if existing user
      const updatedData: { name?: string; image?: string } = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;
      // update the user
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }
    // find the account of the user
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    // if the account does not exits
    if (!existingAccount) {
      // create a new account
      await Account.create(
        [
          {
            userId: existingUser._id,
            username: slugifiedUsername,
            email,
            image,
            name,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }
    // commit your transaction
    await session.commitTransaction();
    return NextResponse.json({ success: true });
    // No extra closing brace here
  } catch (error: unknown) {
    // rollback the changes made
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}

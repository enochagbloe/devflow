import User from "@/database/user.model";
import handleError from "@/lib/handler/error";
import { NotFoundError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/globals";
import { NextResponse } from "next/server";

// GET
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // destructure the id from the params
  const { id } = await params;
  // if the id don't exist throw new NotFoundError()
  if (!id) throw new NotFoundError("User");

  // if you have a an UserId [use a try and catch block]

  try {
    await dbConnect(); // connect to the database
    // when connected extract the user
    const user = await User.findById(id);
    // if you don't have a user
    if (!user) throw new NotFoundError("User");

    // if we have a user
    return NextResponse.json({ success: true, data: User });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // destructure the id
  const { id } = await params;
  // throw new error if the id not found
  if (!id) throw new NotFoundError("User");

  // if we do have an ID connect to the database
  try {
    await dbConnect();

    // find the user
    const user = await User.findByIdAndDelete(id);
    // if there is no user throw an error
    if (!User) throw new NotFoundError("User");
    // if the user successfully deleted
    return NextResponse.json({ success: true, data: user }, { status: 204 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT
export async function PUT(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // destructure the id from the params
  const { id } = await params;
  // throw error if Id not found
  if (!id) throw new NotFoundError("User");

  // if there is an available connect to the database and find the user
  try {
    // connect to database
    await dbConnect()

    // validate the data
    const body = await _.json();
    const validatedData = UserSchema.partial(body);
    // find the user
    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    // if there is no user throw an error
    if (!updatedUser) throw new NotFoundError("User");
    // if the user successfully updated
    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

import Account from "@/database/account.model";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// GET
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // destructure the id from the params
  const { id } = await params;
  // if the id don't exist throw new NotFoundError()
  if (!id) throw new NotFoundError("Account");

  // if you have a an UserId [use a try and catch block]

  try {
    await dbConnect(); // connect to the database
    // when connected extract the account
    const account = await Account.findById(id);
    // if you don't have a account
    if (!account) throw new NotFoundError("Account");

    // if we have a account
    return NextResponse.json({ success: true, data: account }, { status: 200 });
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
  if (!id) throw new NotFoundError("Account");

  // if we do have an ID connect to the database
  try {
    await dbConnect();

    // find the account
    const account = await Account.findByIdAndDelete(id);
    // if there is no account throw an error
    if (!account) throw new NotFoundError("Account");
    // if the account successfully deleted
    return NextResponse.json({ success: true, data: account }, { status: 204 });
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

  // if there is an available connect to the database and find the account
  try {
    // connect to database
    await dbConnect();

    // validate the data
    const body = await _.json();
    const validatedData = AccountSchema.partial().safeParse(body);
    // check if no validated data
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    // find the Account
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    // if there is no account throw an error
    if (!updatedAccount) throw new NotFoundError("Account");
    // if the account successfully updated
    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";

export async function POST(request: Request) {
  // extract the providerAccountId  from the request body
  const { providerAccountId } = await request.json();
  try {
    // CONNECT TO DATABASE
    await dbConnect();
    // validate the validatedData
    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    // if not the validatedData
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    // if the validatedData is valid
    const account = await Account.findOne({ providerAccountId });
    // if the validatedData is not found
    if (!account) throw new NotFoundError("validatedData not found");
    // if the validatedData is found
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

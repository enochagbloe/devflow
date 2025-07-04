import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http.errors";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/globals";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";

export async function POST(request: Request) {
    // extract the providerAccountId  from the request body
    const { providerAccountId } = await request.json();
    try {
        // CONNECT TO DATABASE
        await dbConnect();
        // validate the account
        const account = AccountSchema.partial().safeParse({providerAccountId});
        // if not the account 
        if(!account.success) throw new ValidationError(account.error.flatten().fieldErrors);
        // if the account is valid
        const user = await User.findOne({providerAccountId});
        // if the account is not found
        if(!user) throw new Error("account not found");
        // if the account is found
        return NextResponse.json({success: true, data: user}, {status: 200});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
        
    }
}

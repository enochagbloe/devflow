import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http.errors";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/globals";
import User from "@/database/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // extract the email from the request body
    const { email } = await request.json();
    try {
        // validate the email
        const validationEmail = UserSchema.partial().safeParse({email});
        // if not the email 
        if(!validationEmail.success) throw new ValidationError(validationEmail.error.flatten().fieldErrors);
        // if the email is valid
        const user = await User.findOne({email});
        // if the user is not found
        if(!user) throw new Error("User not found");
        // if the user is found
        return NextResponse.json({success: true, data: user}, {status: 200});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
        
    }
}

"use server";

import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http.errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

// create a type
type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  // if we have access to the params and the schema
  if (params && schema) {
    // try and catch the schema
    try {
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }
  // generate a new session so this is either a next auth session or null
  let session: Session | null = null;
  // check if auth is true
  if (authorize) {
    // get the session
    session = await auth();
  }

  // if not authorized session return an unauthorized error
  if (authorize && !session) return new UnauthorizedError();

 
  // connect to database
  await dbConnect();

  // return the session and the params
  return { session, params };
}

// what are we doing here
// 1. Checking weather the schema and the params are provided and validated
// 2. checking weather the user is authorized or not
// 3. connecting to the database
// 4. returning the session and the params

export default action;

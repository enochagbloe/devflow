import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http.errors";
import { ZodError } from "zod";
import logger from "../logger";

// set a new Type
export type ResponseType = "api" | "server";

// define a function
const formatResponse = (
  // define the parameters
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  // a function that form how the responds should look like
  const responseContent = {
    success: false, // fause by default beacause it has encountered an error
    error: {
      message,
      details: errors,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    // add the logger error
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );
    // add the logger error
    logger.error({ err: error }, `${validationError.message}`);
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }
  if (error instanceof Error) {
    // add the logger error
    logger.error({ err: error }, `${error.message}`);
    return formatResponse(responseType, 500, error.message);
  }
  // add the logger error
  logger.error( {err: error},"An unexpected error occurred");
  return formatResponse(responseType, 500, "Something went wrong");
};

export default handleError;

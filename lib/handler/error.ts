import { NextResponse } from "next/server"
import { RequestError, ValidationError } from "../http.errors"
import { ZodError } from "zod"

// set a new Type
export type ResponseType = 'api'| 'server'

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
        }
    }
    return responseType === 'api' ? NextResponse.json(responseContent, { status}) : { status, ...responseContent}
}

const handleError = (error: unknown, responseType: ResponseType = 'server') =>{
    if(error instanceof RequestError){
        return formatResponse(
            responseType, 
            error.statusCode,
            error.message, 
            error.errors
        )
    }
    if (error instanceof ZodError){
        const validationError = new ValidationError(
            error.flatten().fieldErrors as Record<string, string[]>
        );

        return formatResponse(
            responseType, 
            validationError.statusCode, 
            validationError.message, 
            validationError.errors
        )
    }
    if (error instanceof Error){
        return formatResponse(
            responseType, 
            500, 
            error.message
        )
    }
    return formatResponse(
        responseType, 
        500, 
        "Something went wrong"
    )
}

export default handleError


import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http.errors";
import { AIAnswerSchema } from "@/lib/validation";
import { ErrorResponse } from "@/types/action";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { questionId, content , userAnswer } = body;

    // Validate the input data
    const validationResult = AIAnswerSchema.safeParse({ questionId, content, userAnswer });

    if (!validationResult.success) {
      throw new ValidationError(
        validationResult.error.flatten().fieldErrors
      );
    }

    // Use validated data
    const validatedData = validationResult.data;

    const { text } = await generateText({
      model: openai("gpt-4.1-2025-04-14"),
      prompt: `Generate a markdown-formatted response to the following question: "${validatedData.questionId}".Consider the provided context: **Context:** ${validatedData.content}
      Also, prioritize and incorporate the user's answer when formulating your response:
      **User's Answer:** ${validatedData.userAnswer}
      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
      Provide the final answer in markdown format.`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    // Return the error response instead of just calling handleError
    const errorResponse = handleError(error, "api") as ErrorResponse;
    return NextResponse.json(
      { error: errorResponse.message || "Internal server error" },
      { status: errorResponse.status || 500 }
    );
  }
};
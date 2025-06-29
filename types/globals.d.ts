import { NextResponse } from "next/server";

interface Tag {
  _id: string;
  name: string;
}

interface author {
  _id: string;
  name: string;
  image: string;
  value: string;
}
interface Question {
  _id: string;
  title: string;
  // description: string;
  tags: Tag[];
  author: author;
  createdAt: Date;
  upvotes: number;
  views: number;
  answers: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error: {
    massage: string;
    details: Record<string, string[]>;
  };
  status?: number;
};

// A success Response
type SuccessResponse<T = null> = ActionResponse<T> & {
  success: true;
};
// error response
type ErrorResponse = ActionResponse<undefined> & {
  success: false;
};

// API error response
type APIErrorResponse = NextResponse<ErrorResponds> 
// regular api response
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse >

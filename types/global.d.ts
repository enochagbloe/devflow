import { NextResponse } from "next/server";
import { JSX } from "react";

interface Tag {
  map(arg0: (question: any) => JSX.Element): import("react").ReactNode;
  length: number;
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
  value: string;
}
interface Question {
   _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt?: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
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

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

// types for pagination
type PaginationSearchParams = {
  page?: number; // current page number
  pageSize?: number; // number of items per page
  // total?: number; // total number of items
  query?: string; // for search queries
  filter?: string; // for filtering items
  sort?: string; // for sorting items
}

import { PaginationSearchParams } from "./global";

interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

type ErrorResponse = ActionResponse<undefined> & {
  success: false;
};
type SuccessResponse<T = null> = ActionResponse<T> & {
  success: true;
};

interface AuthCredentials {
  name?: string;
  username?: string;
  email: string;
  password: string;
}
// for creating a question
interface CreateQuestionParams {
  title: string;
  tags: string[];
  content: string;
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionsParams
  extends PaginationSearchParams,
    Omit<PaginationSearchParams, "filter"> {
  tagId: string;
}

interface incrementViewsParams {
  questionId: string;
}
// view increment params
interface viewIncrementParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}
// for the get all answers
interface GetAllAnswersParams extends PaginationSearchParams {
  questionId: string;
}

interface createVoteParams {
  // the votes should work for both questions and answers
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface updateVoteCountParams extends createVoteParams {
  change: 1 | -1;
}

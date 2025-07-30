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
interface CreateQuestionParams{
    title: string;
    tags: string[];
    content: string;
}

interface EditQuestionParams extends CreateQuestionParams{
    questionId: string
}

interface GetQuestionParams{
    questionId: string
}
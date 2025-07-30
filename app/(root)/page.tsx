import Link from "next/link";
import QuestionCard from "@/components/card/QuestionCards";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/localSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { auth } from "@/auth";
import { getQuestions } from "@/lib/actions/question.action";
// import { EMPTY_QUESTIONS } from "@/constants/states";
// import DataRenderer from "@/components/Datarenderer";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const session = await auth();
  console.log("Session: ", session);
  // display the contents from the database
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "", // search query
    filter: filter || "",
    //sort: sort || "createdAt",
  });

  // destructure the questions out from the data
  const questions = data?.questions || [];
  const isNext = data?.isNext || false;
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClass="flex-1"
        />
      </section>
      <HomeFilter />
      {/* <DataRenderer
        success={success}
        error={error ? { message: error.massage, details: error.details } : null}
        empty={EMPTY_QUESTIONS}
        data={questions}
        render={(question) => (
          <QuestionCard
            key={String(question._id)}
            question={{
              ...question,
              _id: String(question._id),
              tags: question.tags.map((tag: any) => ({
                _id: String(tag._id || tag),
                name: tag.name || "",
              })),
            }}
          />
        )}
        // isNext={isNext}
      /> */}
      {success ? (<div className="mt-10 flex w-full flex-col gap-6">
        {questions && questions.length > 0 ? questions.map((question) => (
          <QuestionCard key={String(question._id)} question={{
            ...question, 
            _id: String(question._id),
            tags: question.tags.map((tag: any) => ({
              _id: String(tag._id || tag),
              name: tag.name || ''
            }))
          }} />
        )) : (
         <div className="flex w-full items-center justify-center py-10">
           <p className="text-lg text-dark500_light700">No questions found</p>
         </div>
        )}
      </div>) : (
        <div className="flex w-full items-center justify-center py-10">
          <p className="text-lg text-dark500_light700">Error loading questions</p>
        </div>
      )}
    </>
  );
};

export default Home;

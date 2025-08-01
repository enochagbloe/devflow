import QuestionCard from '@/components/card/QuestionCards';
import HomeFilter from '@/components/filters/HomeFilter';
import ROUTES from '@/constants/routes';
import { getTagQuestions } from '@/lib/actions/tag.action';
import { RouteParams, Tag } from '@/types/global';
import React from 'react'
import LocalSearch from '@/components/search/localSearch';

const TagDetailsPage = async ({params, searchParams}:RouteParams) => {
   const { id } = await params;
   const { page, pageSize, query } = await searchParams;
    // You can use the id, page, pageSize, and query to fetch data

    const { success, data } = await getTagQuestions({
        tagId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
    });

    // destructure the data
    const { tag, questions, isNext } = data || {};
    return (
        <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>

        {/* <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button> */}
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClass="flex-1"
        />
      </section>
      <HomeFilter />
        {/* Render the tag details */}
      {success ? (<div className="mt-10 flex w-full flex-col gap-6">
        {questions && questions.length > 0 ? questions.map((question) => (
          <QuestionCard key={String(question._id)} question={{
            ...question, 
            _id: String(question._id),
            tags: question.tags.map((tag: any) => ({
              _id: String(tag._id || tag),
              name: tag.name || ''
            }) as unknown as Tag)
          }}
           />
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
    )
}

export default TagDetailsPage
import React from "react";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";
import LocalSearch from "@/components/search/localSearch";
import TagCard from "@/components/card/TagCard";

const Tags = async ({ searchParams }: RouteParams) => {
  // destructure the contents from the database to searchParams
  // searchParams is a promise that resolves to an object with keys: page, pageSize
  const { page, pageSize, query, filter } = await searchParams;
  // Fetch tags from the server
  const { success, data } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "", // search query
    filter: filter || "", // filter tags
  });
  // destructure the tags from the data
  const tags = data?.tags || [];
  const isNext = data?.isNext || false;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl ">Tags</h1>

      <section className="mt-11">
        <LocalSearch
          route="/tags" // ✅ Correct route specified
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          iconPosition="left"
          otherClass="flex-1"
        />
      </section>
      {success ? (
        <div className="mt-10 flex w-full flex-wrap gap-4">
          {tags && tags.length > 0 ? (
            tags.map((tag: any) => <TagCard key={tag._id} {...tag} />)
          ) : (
            <p className="items-center justify-center flex w-full text-dark400_light700">
              no tags related
              <span className="font-semibold ">"{query}"</span> found
            </p>
          )}
        </div>
      ) : (
        <p className="mt-10 text-dark400_light700">No tags available</p>
      )}
    </>
  );
};

export default Tags;

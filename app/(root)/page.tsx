import React from "react";
// import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/components/search/localSearch";
import HomeFilters from "./filters/HomeFilter";
// static data for now
const questions = [
  {
    _id: "1",
    title: "How to create a custom hook in react",
    description: "I want to learn how to create a custom hook in react",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "typescript" },
      { _id: "4", name: "next js" },
      { _id: "5", name: "react-query" },
    ],
    author: [{ _id: "1", name: "John Doe" }],
    answers: 10,
    views: 50,
    upvotes: 5,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to use React ",
    description: "I want to learn how to use React",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "typescript" },
      { _id: "4", name: "next js" },
      { _id: "5", name: "react" },
    ],
    author: [{ _id: "1", name: "John Doe" }],
    answers: 10,
    views: 50,
    upvotes: 5,
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "How code javascript",
    description: "I want to learn how to code javascript",
    tags: [
      { _id: "1", name: "javascript" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "typescript" },
    ],
    author: [{ _id: "1", name: "John Doe" }],
    answers: 10,
    views: 50,
    upvotes: 5,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: { [key: string]: string };
}
const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filtereQuestions = questions.filter((question) => {
    const matchQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchQuery && matchFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Question</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search"
          otherClass=""
        />
      </section>
      {/* filters */}
      <HomeFilters />
      {/* map over different question  */}
      <div className="mt-10 w-full flex-col gap-6">
        {filtereQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;

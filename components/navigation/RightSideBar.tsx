import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../card/TagCard";
// Specify your hot questions in array- objects
// this is found below the Top Questions
const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in react" },
  { _id: "2", title: "How to use React Query" },
  { _id: "3", title: "How to use Redux?" },
  { _id: "4", title: "How to React Router" },
  { _id: "5", title: "How to React Context" },
];

// this will be destructured as props in the TagCard.tsx file
// popular tags should have an id, name and number of question
const popularTags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "javascript", questions: 200 },
  { _id: "3", name: "typescript", questions: 150 },
  { _id: "4", name: "next js", questions: 50 },
  { _id: "5", name: "react-query", questions: 79 },
];

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden ">
      <div>
        <h3 className="h3-bold text-dark200_light900"> Top Questions </h3>
        {/* Map your hot Questions here */}
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {/* create a profile link in the ROUTES.ts File PROFILE: (id: string)=> `/profile/${id}` */}

          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
              className="flex cursor-pointer items-center justify-between"
            >
              <p className="body-medium text-dark500_light700">{title}</p>

              <Image
                src="./icons/chevron-right.svg"
                alt="chevron"
                height={20}
                width={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      {/* Map your popularTags here */}
      <div className="mt-16">
        <div className="h3-bold text-dark200_light900">
          <h3>Popular Tags</h3>
          <div className="mt-7 flex flex-col gap-4 ">
            {popularTags.map(({ _id, name, questions }) => (
              <TagCard
                key={_id}
                _id={_id}
                name={name}
                questions={questions}
                showCount
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;

import TagCard from "@/components/card/TagCard";
import { Preview } from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";

import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatViewsNumber, getTimeStamp } from "@/lib/utils";
import { Question, RouteParams } from "@/types/global";
import Link from "next/link";

import { redirect } from "next/navigation";
import React from "react";

// This is the page that displays the question details
// It fetches the question by ID and displays its content, author, tags, and other
const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const [_, { success, data: question }] = await Promise.all([
    // increment views server call
    await incrementViews({ questionId: id }),
    // getQuestion server call
    await getQuestion({ questionId: id }),
  ]);

  if (!success || !question) return redirect(ROUTES.NOT_FOUND);

  // Type assertion to properly type the question data
  const questionData = question as unknown as Question;
  // Destructure all needed properties including content
  const { author, createdAt, answers, views, tags, content, title } =
    questionData;

  return (
    <>
      {/* Question details layout */}
      <div className="flex-start w-full flex-col">
        <div className="w-full flex flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            {/* author image */}
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
            />
            {/* author name */}
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          {/* second part of the layout */}
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      {/* to track all  the metrics */}
      <div className="flex flex-wrap gap-4 mt-5 mb-8">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock value"
          value={` asked ${getTimeStamp(new Date(createdAt || Date.now()))}`}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message value"
          value={answers}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye value"
          value={formatViewsNumber(views)}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
      </div>
      {/* Preview Section */}
      <Preview content={content} />
      {/* Tags Section */}
      <div className="mt-8 flex flex-wrap gap-2">
        {/* map over the tags and display them */}
        {tags.map((tag: { _id: string; name: string }) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <section className="mt-16 w-full">
        <AnswerForm />
      </section>
    </>
  );
};

export default QuestionDetails;

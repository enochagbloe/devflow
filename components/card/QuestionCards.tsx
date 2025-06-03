import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";

interface Props {
  question: Question;
}
const QuestionCards = ({
  question: { _id, title, tags, author, createdAt, upvotes, views, answers },
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            {" "}
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.4 flex w-full flex-warp gap-2 mt-6">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-warp gap-3">
        {/* Metric for the author */}
        <Metric
          imageUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor={true}
        />
        <div className="flex item-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          {/* Metric for the likes */}
          <Metric
            imageUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title="votes"
            textStyles="small-medium"
          />
          {/* Metric for the answers */}
          <Metric
            imageUrl="/icons/message.svg"
            alt="like"
            value={answers}
            title="answers"
            textStyles="small-medium"
          />
          {/* Metric for the views */}
          <Metric
            imageUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="views"
            textStyles="small-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCards;

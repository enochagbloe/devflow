import { Answer, Author } from "@/types/global";
import React from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import { Preview } from "../editor/Preview";

const AnswerCard = ({
  _id,
  answer,
  author,
}: {
  _id: string;
  answer: Answer;
  author: Author;
}) => {
  return (
    <div>
      <div className="flex gap-2 justify-between">
        <div className="flex items-start gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 object-contain rounded-full max:sm:mt-2"
          />
          <div className="sm:flex flex-col">
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className=" text-dark200_light900">{author.name}</p>
            </Link>
            <p className="text-[12px] text-gray-500 ">
              answered {getTimeStamp(new Date(answer.createdAt ?? new Date()))}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <p>Votes:</p>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {/* <p>Posted on: {new Date(answer.createdAt).toLocaleDateString()}</p> */}
        <Preview content={answer.content} />
      </div>
    </div>
  );
};

export default AnswerCard;

import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";
import Image from "next/image";
interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  remove?: boolean;
  handleRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  handleRemove,
  isButton,
}: Props) => {
  const iconClass = name
    ? getDeviconClassName(name)
    : "devicon-devicon-plain colored";

  const displayName = name || "Unknown Tag";

  const linkContent = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 p-0 bg-transparent border-none cursor-pointer"
            aria-label="Remove tag"
          >
            <Image
              src="/icons/close.svg"
              alt="remove tag"
              width={16}
              height={16}
              className="invert-0 hover: cursor-pointer dark:invert"
            />
          </button>
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );
  if (compact) {
    return isButton ? (
      <div>
        <button className="flex justify-between gap-2 pt-2">
          {linkContent}
        </button>
      </div>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {linkContent}
      </Link>
    );
  }
  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
      {linkContent}
    </Link>
  );
};

export default TagCard;

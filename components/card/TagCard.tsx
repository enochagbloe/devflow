import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import {getDeviconClassName} from "@/lib/utils"
// install scadcn badge components

// the tag need to have an info in it like an id, name, question etc
// what to find 1. number of questions related to the tag 2. Name of the card, Icon for the tags and id of the tag

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
}
// define your props above in an object
const TagCard = ({ _id, name, questions, showCount }: Props) => {

   const iconclass = getDeviconClassName(name)

  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-3">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconclass} text-sm`}/>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </Link>
  );
};

export default TagCard;



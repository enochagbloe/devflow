"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
interface Props {
  upvotes: number;
  downvotes: number;
  hasVoted: boolean;
  hasDownVoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasVoted, hasDownVoted }: Props) => {
  // let's set loading states
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const UserId = session.data?.user?.id;
  // handle Click
  const handleVote = (type: "upvote" | "downvote") => {
    // TODO: Implement vote handling logic
    if (!UserId) toast.error("You must be logged in to vote");

    try {
      const successMessage =
        type === "upvote" ? "Upvoted successfully!" : "Downvoted successfully!";

      if (type === "downvote") {
        toast.success(successMessage);
      } else if (type === "upvote") {
        toast.success(successMessage);
      }
    } catch (error) {
      toast.error("Something wrong happened");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="items-center flex gap-3">
      <div className="flex items-center">
        <Image
          src={hasVoted ? "/icons/upvote.svg" : "/icons/upvoted.svg"}
          alt="upvote"
          height={20}
          width={20}
          className="cursor-pointer"
          onClick={() => !loading && handleVote("upvote")}
        />
        <p> {formatNumber(upvotes)} </p>
      </div>
      <div className="flex items-center">
        <Image
          src={hasDownVoted ? "/icons/downvote.svg" : "/icons/downvoted.svg"}
          alt="downvote"
          height={20}
          width={20}
          className="cursor-pointer"
          onClick={() => !loading && handleVote("downvote")}
        />
        <p> {formatNumber(downvotes)} </p>
      </div>
    </div>
  );
};

export default Votes;

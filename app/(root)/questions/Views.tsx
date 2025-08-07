'use client';

import { incrementViews } from "@/lib/actions/question.action";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  questionId: string;
}
const Views = ({questionId}: Props) => {
const handleIncrementViews = async () => {
    const result = await incrementViews({
      questionId,
    });
    if(result.success) {
        toast.success("Successfully incremented views");
    }else{
        toast.error("Views incremented successfully");
    }
}

useEffect(() => {
    // Increment views when the component mounts
    handleIncrementViews();
},[])
  return null;
}

export default Views
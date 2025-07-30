import React from 'react'
import { getTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  // Fetch tags from the server
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "test",
    filter: "",
  });
  // destructure the tags from the data
  const tags = data?.tags || {};
  const isNext = data?.isNext || false;

  return (
    <div>Tags</div>
  )
}

export default Tags
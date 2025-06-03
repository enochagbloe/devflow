"use client";
import { Button } from "@/components/ui/button";
import { formUrlQuery, removeKeysFormUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const filters = [
  {name: "JavaScript", value: "javascript"},
  {name: "React", value: "react"},
  {name: "Next.js", value: "nextjs"},
  {name: "Tailwind", value: "tailwind"},
];
const HomeFilter = () => {
  // to give the filters a differnt classNames if it is active
  // each click on the filter should change the value in the url bar
  const searchParams = useSearchParams();
  const selectedFilter = searchParams.get("filter");
  const [activeFilter, setActiveFilter] = useState(selectedFilter || "");
  const router = useRouter();

  const handleClick = (filter: string) => {
    let newUrl = "";

    if (filter === activeFilter) {
      setActiveFilter("");
      newUrl = removeKeysFormUrlQuery({
        params: searchParams.toString(),
        keystoRemove: ["filter"],
      });
    } else {
      setActiveFilter(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
            activeFilter === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;

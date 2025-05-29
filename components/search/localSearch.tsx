"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFormUrlQuery } from "@/lib/url";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClass?: string;
}

const LocalSearch = ({ route, imgSrc, placeholder, otherClass }: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    // Get the search params from the URL
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
             if (searchQuery) {
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "query",
                value: searchQuery,
            });

            // Update the URL with the new search query
            router.push(newUrl, {
                scroll: false, // Prevent scrolling to the top
            });
        }
        else {
            // If the search query is empty, remove it from the URL
            if (pathname === route && searchParams.has("query")) {
                const newUrl = removeKeysFormUrlQuery({
                    params: searchParams.toString(),
                    keystoRemove: ["query"],
                    // value: searchQuery,
                })
                router.push(newUrl, {
                    scroll: false, // Prevent scrolling to the top
                });
            }
        }
        }, 300)

        return () => {clearTimeout(delayDebounceFn)} 
    }, [searchQuery, router, searchParams, route, pathname]);
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClass}`}
    >
      <Image
        src={imgSrc}
        width={20}
        height={20}
        alt="search icon"
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="no-focus paragraph-regular placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearch;

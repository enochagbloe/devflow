import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
  href?: string;
  titleStyles?: string;
}
const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  imgStyles,
  isAuthor,
  href,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      <Image
        alt={alt}
        src={imgUrl}
        className={` rounded-full object-contain ${imgStyles}`}
        width={16}
        height={16}
      />
      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>

      {title ? (
        <span
          className={cn(`small-regular line-clamp-1`, titleStyles)}
        >
          {title}
        </span>
      ) : null}
      {/* If the title is not provided, we can just return the value and image */}
      {/* If href is provided, we wrap the content in a Link component */}
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;

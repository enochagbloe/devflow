import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imageUrl: string;
  alt: string;
  value: string | number;
  title: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
  href?: string;
}
const Metric = ({
  imageUrl,
  alt,
  value,
  title,
  textStyles,
  imgStyles,
  isAuthor,
  href,
}: Props) => {
  const metricContent = (
    <>
      <Image
        alt={alt}
        src={imageUrl}
        className={` rounded-full object-contain ${imgStyles}`}
        width={16}
        height={16}
      />
      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>
      <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}>{title}</span>
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">{metricContent}</Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;

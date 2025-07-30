import { DEFAULT_EMPTY } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// define the interface
interface Props<T> {
  success: boolean;
  data: T[] | null | undefined;
  error: {
    message: string;
    details?: Record<string, string[]>;
  } | null;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full items-center flex-col justify-center sm:mt-36">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
    </>
    <h2 className="h2-bold mt-6 text-dark200_light900">{title}</h2>
    <p className="body-regular text-dark500_light700 my-3.5 text-center max-w-md">
      {message}
    </p>
    {button && (
      <Link 
        href={button.href}
        className="paragraph-medium rounded-lg bg-primary-500 mt-5 px-4 py-3 text-white-900 hover:bg-primary-500"
      >
        {button.text}
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  data,
  error,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  // Handle error state
  if (error) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Error State illustration",
        }}
        title="Something went wrong"
        message={error.message}
      />
    );
  }

  // Handle empty/no data state
  if (!success || !data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty State illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  // Render data
  return (
    <div>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {render(item)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DataRenderer;
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="flex-between fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="dev flow logo"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          {" "}
          Dev <span className="text-primary-500">Flow</span>
        </p>
      </Link>
    </nav>
  );
};

export default Navigation;

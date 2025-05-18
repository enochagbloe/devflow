import React from "react";
import NavLinks from "./nav/NavLinks";
import ROUTES from "@/constants/routes";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const LeftSideBar = () => {
  return (
    <aside className=" background-light900_dark200 light-border sticky left-0 top-0 z-10 h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          className="small-medium btn-secondary mt-12 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src={"/icons/account.svg"}
              alt=""
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <p className="primary-text-gradient max-lg:hidden"> Log in </p>
          </Link>
        </Button>

        <Button className="small-medium btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
          <Link href={ROUTES.SIGN_UP}>
            <p className="primary-text-gradient"> Sign up </p>{" "}
          </Link>
        </Button>
      </div>
    </aside>
  );
};

export default LeftSideBar;

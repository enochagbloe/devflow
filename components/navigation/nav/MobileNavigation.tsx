import React from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "./NavLinks";

import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            height={36}
            width={30}
            alt="menu"
            className="invert-colors sm:hidden"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="background-light900_dark200 border-none"
        >
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src="/images/site-logo.svg"
              alt="DevFlOW Logo"
              width={23}
              height={23}
            />
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev <span className="text-primary-500"> Flow </span>
            </p>
          </Link>
          <div className="flex h-[calc(100vh-80px)] flex-col justify-center overflow-hidden overflow-y-auto">
            {" "}
            <SheetClose asChild>
              <section className="mt-6 flex h-full flex-col gap-2 overflow-y-scroll pt-3 scrollbar-hide">
                <NavLinks isMobileNav />
              </section>
            </SheetClose>
            <div className="flex flex-col gap-6">
              {userId ? (
                <SheetClose asChild>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();

                      <Button
                        type="submit"
                        className="base-medium w-fit !bg-transparent px-4 py-3"
                      >
                        <LogOut className="size-5 text-black dark:text-white" />
                        <span className="text-dark300_light900 max-lg:hidden">
                          Logout
                        </span>
                      </Button>;
                    }}
                  ></form>
                </SheetClose>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link href={ROUTES.SIGN_IN}>
                      <Button className="small-medium btn-secondary mt-12 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                        <p className="primary-text-gradient"> Log in </p>
                      </Button>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href={ROUTES.SIGN_UP}>
                      <Button className="small-medium btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                        <p className="primary-text-gradient"> Sign up </p>
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNavigation;

"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ isMobileNav = false, userId,}: { isMobileNav?: boolean, userId?: string }) => {
  const path = usePathname();
  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive =
          (path.includes(item.route) && item.route.length > 1) ||
          path === item.route;

        if (item.route === "/profile") {
          if (userId) item.route = `${item.route}/${userId}`;
        }

        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark-300_light900",
              "flex items-center gap-4 p-4 bg-transparent justify-start "
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn(
                isActive ? "invert-colors" : "invert-colors opacity-50"
              )}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-small",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {item.label}
            </p>
          </Link>
        );
        return LinkComponent;
      })}
    </>
  );
};

export default NavLinks;

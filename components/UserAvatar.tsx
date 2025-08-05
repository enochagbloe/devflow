import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string; // Make id required
  name: string;
  imageUrl?: string | null; // optional image URL
  className?: string; // optional className for styling
  fullbackClassname?: string; // optional fallback text
}
// accept all the props
const UserAvatar = ({ id, name, imageUrl, className = "h-9 w-9", fullbackClassname }: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {/* // if imageUrl is provided, use it as the avatar image */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            quality={100}
            width={36}
            height={36}
          />
        ) : (
          <AvatarFallback className={cn("font-space-grotesk font-bold primary-gradient tracker-wider text-black dark:text-white", fullbackClassname)}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;

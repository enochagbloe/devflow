import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ✅ Use shadcn/ui components
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fullbackClassname?: string;
}

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
        {imageUrl ? (
          <AvatarImage 
            src={imageUrl} 
            alt={name}
            className="object-cover"
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
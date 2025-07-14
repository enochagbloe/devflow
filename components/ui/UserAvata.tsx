import ROUTES from "@/constants/routes";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  className?: string; // optional className for styling
}
// accept all the props
const UserAvata = ({ id, name, imageUrl, className = "h-9 l-g" }: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link>
      href={ROUTES.PROFILE(id)}
      <Avatar className={className}>
        // if imageUrl is provided, use it as the avatar image
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
          <AvatarFallback className="font-space-grotesk font-bold primary-gradient tracker-wider text-black dark:text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvata;

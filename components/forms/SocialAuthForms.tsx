'use client'

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import ROUTES from "@/constants/routes";
import { signIn } from "@/auth";

const SocialAuthForms = () => {

    const ButtonClass = "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

    const handleSignIn = async (provider: "github" | "google") => {
      try {
       // throw new Error(` ${provider} Not implemented yet`);
       await signIn(provider, {
        callbackUrl: ROUTES.HOME, 
        redirect: false,
       });
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "Sign-in failed");
      }
    }
 // Add more social media icons as needed and customize the styles as per your needs.
  return (
    <div className="mt-10 flex flex-wrap  gap-4">
      <Button className={ButtonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="github Icon"
          width={20}
          height={20}
          className=" invert-colors mr-2.5 object-contain"
        />
        Continue with Github
      </Button>

      <Button className={ButtonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Icon"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        Continue with Google
      </Button>
    </div>
  );
};

export default SocialAuthForms;



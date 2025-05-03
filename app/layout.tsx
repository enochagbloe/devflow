import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode } from "react";
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";


const inter = localFont({
  src: "./fonts/interVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src : "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-SpaceGrotesk",
  weight: "300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Dev Flow",
  description:"A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons:{
    icon: "../public/images/site-logo.svg",
  }
};

const RootLayout = async ({children}: {children : ReactNode}) => {

  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
        attribute= "class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={true}>
        {children}
        </ThemeProvider>
        <Toaster/>
      </body>
      </SessionProvider>
    </html>
  );
}
export default RootLayout;
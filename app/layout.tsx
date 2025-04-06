import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
    </html>
  );
}

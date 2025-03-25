import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import google from "next-auth/providers/google"
// Configure NextAuth with your GitHub app credentials
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [github, google],
})
import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import google from "next-auth/providers/google"
import { api } from "./lib/api"
import { ActionResponse } from "./types/globals"
import {  IAccountDoc } from "./database/account.model"
// Configure NextAuth with your GitHub app credentials
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [github, google],
  // add your callbacks
  callbacks: {
    // callback for sessions
    async session({ session, token }){
      session.user.id = token.sub as string
      return session
    },
    // callback for jwt token
   async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    // callback when the user logs in
    async signIn({ user, profile, account }) {
      // when the user tries logging in with emil and password
      if(account?.type === 'credentials') return true
      if (!account || !user) return false;

      // Gather the user info
      const userInfo ={
        name: user.name!,
        email: user.email!,
        image: user.image!,
        // check if the provider is github
        username:
        account.provider === "github" ? (profile?.login as string) : (user.name?.toLocaleLowerCase() as string)
      }
      // call the Api
      const { success } = await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as 'github' | 'google',
        providerAccountId: account.providerAccountId
      }) as ActionResponse

      if(!success) return false

      return true
    }
  },
})
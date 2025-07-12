import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { api } from "./lib/api"
import { ActionResponse } from "./types/globals"
import {  IAccountDoc } from "./database/account.model"
import { SignInSchema } from "./lib/validation"
import { IUserDoc } from "./database/user.model"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
// Configure NextAuth with your GitHub app credentials
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Github, Google, 
    Credentials({
    async authorize(credentials) {
      //validate your data
        const validatedFields = SignInSchema.safeParse(credentials);
        // if the validation is successful
        // Destructure the emails and password from the validated fields
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          // get the account api by email as ActionResponse<IAccountDoc>
          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;
          // if the existingaccount is not found return null
          if (!existingAccount) return null;
          
          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
  }) 
  ],

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
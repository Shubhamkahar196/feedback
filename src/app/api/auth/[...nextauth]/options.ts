import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const nextAuth: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credetials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        // connection db
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          //   checking user
          if (!user) {
            throw new Error("No user found with this email!");
          }
          // check user verified
          if (!user.isVerified) {
            throw new Error("Please verify your account before login ");
          }

          // check user password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("User password is incorrect try again");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks:{
       async session({ session,  token }) {
      return session
    },
    async jwt({ token,  user }) {
        if(user){
            token._id = user._id?.toString()
        }
      return token
    }
  },
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { text } from "stream/consumers";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import Email from "next-auth/providers/email";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPassword = await compare(
          credentials.password,
          findUser.password
        );

        if (!isPassword) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.firstName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }

        if (!user?.email) {
          return false;
        }

        const findUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });
        return !!findUser;
      } catch (error) {
        console.log("Error [SIGN IN]");
      }
      return false;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }
      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (findUser) {
        token.id = findUser.id;
        token.email = findUser.email;
        token.name = findUser.firstName;
        token.role = findUser.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

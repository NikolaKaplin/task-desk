import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import "dotenv/config"
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

        const [findUser] = await db
          .selectDistinct()
          .from(userTable)
          .where(eq(userTable.email, values.email));

        if (!findUser) {
          return null;
        }

        const isPassword = await compare(
          credentials.password,
          findUser.passwordHash
        );

        if (!isPassword) {
          return null;
        }

        return {
          id: findUser.id,
          avatar: findUser.avatarUrl,
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

        const [findUser] = await db
          .selectDistinct()
          .from(userTable)
          .where(eq(userTable.email, user.email));
          console.log(findUser)
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
      const [findUser] = await db
        .selectDistinct()
        .from(userTable)
        .where(eq(userTable.email, token.email));
      if (findUser) {
        token.id = findUser.id;
        token.email = findUser.email;
        token.name = findUser.firstName;
        token.avatar = findUser.avatarUrl || "";
        token.role = findUser.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { type GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { prisma } from "~/server/db";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "~/lib/zod";
import { checkuser } from "./user";
import { User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/",
    error: "/",
    newUser: "/auth/sign-up",
  },
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true;
      }
      return false;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    session({ session, user }) {
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuidv4();

        if (!params.token.sub) {
          throw new Error("No User found in the token");
        }

        if(!adapter || !adapter.createSession) {
          throw new Error("Adapter not found");
        }

        const createdSession = await adapter.createSession({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Session not created");
        }
        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  adapter: adapter,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const isValid = signInSchema.safeParse(credentials);
          if(!isValid.success) {
            return null;
          }
          const {email, password} = await signInSchema.parseAsync(credentials);

          const res = await checkuser(email, password);
          if (res.success) {
            return res.data as User;
          }

          return null;
        } catch (err) {
          console.error("Authorization failed:", err);
          return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

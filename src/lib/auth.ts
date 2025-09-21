import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";
import { AuthOptions } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaClient) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("No credentials provided");
        }

        let user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              name: credentials.email.split("@")[0],
              email: credentials.email,
              userAdm: {
                create: {
                  permission: "admin",
                },
              },
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = { ...session.user, id: user.id } as {
        id: string;
        name: string;
        email: string;
      };
      return session;
    },
  },
};

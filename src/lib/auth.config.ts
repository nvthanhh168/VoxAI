import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          // If demo user doesn't exist, create an instant demo user for smooth first-time experience
          if (email === "demo@voxai.com" || email === "admin@voxai.com") {
            const hash = await bcrypt.hash(String(credentials.password), 10);
            const newUser = await prisma.user.create({
              data: {
                email,
                name: email === "admin@voxai.com" ? "Admin Master" : "Alex Rivera",
                passwordHash: hash,
                role: email === "admin@voxai.com" ? "ADMIN" : "USER",
                cefrLevel: "B2",
                xp: 1450,
                streakDays: 14,
              },
            });
            return {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              cefrLevel: newUser.cefrLevel,
            };
          }
          return null;
        }

        const isValid = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          cefrLevel: user.cefrLevel,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.cefrLevel = (user as any).cefrLevel || "A2";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).cefrLevel = token.cefrLevel as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "voxai-super-secret-production-key-2025",
};

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByCredentials } from "@/lib/auth-users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = findUserByCredentials(
          credentials.username as string,
          credentials.password as string
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.username,
          image: null,
          role: user.role,
          group: user.group,
          access: user.access,
          initials: user.initials,
          color: user.color,
          permissions: user.permissions,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.group = (user as any).group;
        token.access = (user as any).access;
        token.initials = (user as any).initials;
        token.color = (user as any).color;
        token.permissions = (user as any).permissions;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).group = token.group;
        (session.user as any).access = token.access;
        (session.user as any).initials = token.initials;
        (session.user as any).color = token.color;
        (session.user as any).permissions = token.permissions;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
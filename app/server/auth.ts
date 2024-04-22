import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { LoginUser } from "@/wp-api/mutations/user";
import { randomUUID, randomBytes } from "crypto";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Sign up",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "paulo.pinho@hire.me",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "paulopinho",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("creadentiuals", credentials, "req", req);

        const res = await LoginUser({
          username: credentials?.username || "",
          password: credentials?.password || "",
        });

        if (res.errors) {
          if (res.errors[0].message === "invalid_username") {
            throw new Error("Invalid username or password");
          }
        } else {
          const user = await res.login;

          if (user) {
            return {
              ...user,
              ...user.user,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("REDIRECT", url, baseUrl);
      if (url.startsWith("/"))
        return `${baseUrl}${url}`; // Allows relative callback URLs
      else if (new URL(url).origin === baseUrl) return url; // Allows callback URLs on the same origin
      return baseUrl;
    },
    async signIn({ user, account, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        console.log("SIGN IN: ", user, account, credentials);
        return true;
      } else {
        // Return false to display a default error message
        console.log("NOT SIGNED IN");
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },

    async jwt({ user, token, account, profile, trigger, session }) {
      console.log("JWT", user, token, account, profile, trigger, session);
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.avatar?.url;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("SESSION", session, token, user);
      // Send properties to the client, like an access_token and user id from a provider.
      /*    session.    accessToken = token.accessToken; */

      return session;
    },
    /*     session: async ({ session, token, user }) => ({
   
      ...session,
      maxAge: 30 * 24 * 60 * 60, // 30 days,
      generateSessionToken: () => {
        return randomUUID?.() ?? randomBytes(32).toString("hex");
      },
      user: {
        ...session.user,
        id: token.sub,
      },
    }), */
  },
  pages: {
    /*     signIn: "/dashboard", */
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

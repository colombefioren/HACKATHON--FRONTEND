import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins/username";
import { prisma } from "../db/prisma";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
       getUserInfo: async (token) => {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );
        const profile = await response.json();
        return {
          user: {
            id: profile.id,
            name: profile.name,
            username: `${profile.given_name.trim().toLowerCase()}${profile.id}`,
            displayUsername: `${profile.given_name.trim().toLowerCase()}${
              profile.id
            }`,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.verified_email,
          },
          data: profile,
        };
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
         getUserInfo: async (token) => {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            Accept: "application/vnd.github+json",
          },
        });

        const profile = await response.json();

        let email = profile.email;
        if (!email) {
          const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              Accept: "application/vnd.github+json",
            },
          });
          const emails = await emailRes.json();
          email = emails[0]?.email || null;
        }

        return {
          user: {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            username: profile.login,
            displayUsername: profile.login,
            email,
            image: profile.avatar_url,
            emailVerified: !!email,
          },
          data: profile,
        };
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: true,
      },
      displayUsername: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [username()],
});
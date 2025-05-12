import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/db";
import { ac, admin, external, member, unknown } from "@/lib/auth/permissions";

import { redis } from "./db/redis";
import { env } from "./env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    secondaryStorage: redis,
    user: {
        additionalFields: {
            score: {
                type: "number",
                defaultValue: 0,
                sortable: true,
                input: false, // Hide from user input
            },
            // TODO: add position, biography and username,
            //! Note that username can be replaced by the better-auth implementation
            //! With the username plugin (https://www.better-auth.com/docs/plugins/username)
        },
    },
    plugins: [
        adminPlugin({
            ac,
            roles: {
                admin,
                member,
                external,
                unknown,
            },
            adminRoles: ["admin"],
        }),
    ],
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
        discord: {
            clientId: env.DISCORD_CLIENT_ID as string,
            clientSecret: env.DISCORD_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    databaseHooks: {
        account: {
            create: {
                before: async (account) => {
                    if (account.providerId === "discord") {
                        // TODO:
                        // check if the user is a member of 404 checkIfUserIsMemberOf404
                        // role unknown if not in 404 discord server
                        // role external if in 404 discord server
                        // role member if in 404 discord server as member
                        // role admin if in 404 discord server as admin
                    }
                    return { data: account };
                },
            },
        },
    },
});

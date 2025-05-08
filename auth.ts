import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/db";
import { ac, admin, external, member, unknown } from "@/lib/auth/permissions";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
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
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
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

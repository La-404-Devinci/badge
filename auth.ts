import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/db";
import { ac, admin, user, member } from "@/lib/auth/permissions";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [
        adminPlugin({
            ac,
            roles: {
                admin,
                user,
                member,
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
});

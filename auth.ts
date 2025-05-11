import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "@/db";

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
        },
    },
    plugins: [admin()],
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
        discord: {
            clientId: env.DISCORD_CLIENT_ID as string,
            clientSecret: env.DISCORD_CLIENT_SECRET as string,
        },
    },
});

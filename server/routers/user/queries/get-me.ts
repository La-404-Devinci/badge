import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import type { UserQueryContext } from "./types";

export const getMe = async ({ db, session }: UserQueryContext) => {
    const result = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        with: {
            accounts: {
                columns: {
                    providerId: true,
                    accountId: true,
                },
            },
        },
    });
    return result;
};

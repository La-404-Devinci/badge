import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import { UserQueryContext } from "./types";

export const getUserWithSubscription = async ({
    session,
    db,
}: UserQueryContext) => {
    return await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        with: {
            subscription: true,
        },
    });
};

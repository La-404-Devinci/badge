import { eq } from "drizzle-orm";

import { userPreferences } from "@/db/schema";

import type { UserQueryContext } from "./types";

export async function getUserPreferences({ db, session }: UserQueryContext) {
    const [preferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, session.user.id));

    return preferences || null;
}

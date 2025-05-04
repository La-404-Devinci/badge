import { eq } from "drizzle-orm";

import { userPreferences } from "@/db/schema";

import { UserQueryContext } from "./types";

export const getUserLocale = async ({ db, session }: UserQueryContext) => {
    const [result] = await db
        .select({ language: userPreferences.language })
        .from(userPreferences)
        .where(eq(userPreferences.userId, session.user.id))
        .limit(1);

    console.log(session.user.id, "session.user.id");

    console.log(result);

    return result?.language;
};

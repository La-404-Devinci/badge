import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import type { UserQueryContext } from "./types";

export async function getUserProfile({ db, session }: UserQueryContext) {
    const userId = session.user.id;

    const [userData] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
            role: user.role,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    return userData;
}

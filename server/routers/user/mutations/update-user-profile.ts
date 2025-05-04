import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import type { UserMutationContext, UpdateUserProfileInput } from "./types";

export async function updateUserProfile({
    db,
    session,
    input,
}: UserMutationContext<UpdateUserProfileInput>) {
    const { fullName, image } = input;
    const userId = session.user.id;

    await db
        .update(user)
        .set({
            name: fullName,
            image: image,
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

    return { success: true };
}

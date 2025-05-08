import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import type { UserMutationContext, UpdateUserProfileInput } from "./types";

export async function updateUserProfile({
    db,
    session,
    input,
}: UserMutationContext<UpdateUserProfileInput>) {
    const { fullName, image, position, biography, username } = input;
    const userId = session.user.id;

    console.log(fullName, image, position, biography, username);
    console.log(userId);
    await db
        .update(user)
        .set({
            name: fullName,
            image: image,
            position: position,
            biography: biography,
            username: username,
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

    return { success: true };
}

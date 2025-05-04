import { eq } from "drizzle-orm";

import { userPreferences } from "@/db/schema";

import type { UserMutationContext, SaveUserPreferencesInput } from "./types";

export async function saveUserPreferences({
    db,
    session,
    input,
}: UserMutationContext<SaveUserPreferencesInput>) {
    // Check if user already has preferences
    const [existingPreferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, session.user.id));

    if (existingPreferences) {
        // Update existing preferences
        await db
            .update(userPreferences)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(userPreferences.userId, session.user.id));

        return { success: true };
    } else {
        // Create new preferences
        await db.insert(userPreferences).values({
            userId: session.user.id,
            ...input,
        });

        return { success: true };
    }
}

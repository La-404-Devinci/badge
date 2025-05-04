import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { notificationSettings } from "@/db/schema";

import type {
    NotificationMutationContext,
    UpdateNotificationSettingsInput,
} from "./types";

export async function updateNotificationSettings({
    db,
    session,
    input,
}: NotificationMutationContext<UpdateNotificationSettingsInput>) {
    const userId = session.user.id;

    try {
        // First, check if notification settings exist for the user
        const [existingSettings] = await db
            .select({ id: notificationSettings.id })
            .from(notificationSettings)
            .where(eq(notificationSettings.userId, userId));

        if (!existingSettings) {
            // If not, create new notification settings
            const [newSettings] = await db
                .insert(notificationSettings)
                .values({
                    userId,
                    ...input,
                    updatedAt: new Date(),
                })
                .returning();

            return { success: true, data: newSettings };
        } else {
            // If yes, update existing notification settings
            const [updatedSettings] = await db
                .update(notificationSettings)
                .set({
                    ...input,
                    updatedAt: new Date(),
                })
                .where(eq(notificationSettings.userId, userId))
                .returning();

            return { success: true, data: updatedSettings };
        }
    } catch (error) {
        console.error("Error updating notification settings:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update notification settings",
        });
    }
}

import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { notificationSettings } from "@/db/schema";

import type {
    NotificationMutationContext,
    ToggleNotificationSettingInput,
} from "./types";

export async function toggleNotificationSetting({
    db,
    session,
    input,
}: NotificationMutationContext<ToggleNotificationSettingInput>) {
    const userId = session.user.id;
    const { settingName, enabled } = input;

    try {
        // Check if user has notification settings
        const [existingSettings] = await db
            .select({ id: notificationSettings.id })
            .from(notificationSettings)
            .where(eq(notificationSettings.userId, userId));

        if (!existingSettings) {
            // Create default settings with the specified setting toggled
            const defaultSettings = {
                userId,
                newsUpdatesEnabled: true,
                promotionsOffersEnabled: false,
                remindersSystemAlertsEnabled: true,
                emailEnabled: true,
                pushEnabled: true,
                smsEnabled: false,
            };

            // Override the specified setting
            const settings = {
                ...defaultSettings,
                [settingName]: enabled,
            };

            const [newSettings] = await db
                .insert(notificationSettings)
                .values(settings)
                .returning();

            return { success: true, data: newSettings };
        } else {
            // Update the specified setting
            const [updatedSettings] = await db
                .update(notificationSettings)
                .set({
                    [settingName]: enabled,
                    updatedAt: new Date(),
                })
                .where(eq(notificationSettings.userId, userId))
                .returning();

            return { success: true, data: updatedSettings };
        }
    } catch (error) {
        console.error("Error toggling notification setting:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to toggle ${settingName}`,
        });
    }
}

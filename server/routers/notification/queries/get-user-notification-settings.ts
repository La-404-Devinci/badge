import { eq } from "drizzle-orm";

import type { Database } from "@/db";
import { notificationSettings } from "@/db/schema";
import { Session } from "@/lib/auth/types";

interface GetUserNotificationSettingsParams {
    db: Database;
    session: Session;
}

export async function getUserNotificationSettings({
    db,
    session,
}: GetUserNotificationSettingsParams) {
    // Get the notification settings for the current user
    const [settings] = await db
        .select()
        .from(notificationSettings)
        .where(eq(notificationSettings.userId, session.user.id));

    return settings || null;
}

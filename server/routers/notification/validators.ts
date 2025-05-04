import { z } from "zod";

import { notificationSettingsSchema } from "@/db/schema";

export const updateNotificationSettingsSchema = notificationSettingsSchema;

export const toggleNotificationSettingSchema = z.object({
    settingName: z.enum([
        "newsUpdatesEnabled",
        "promotionsOffersEnabled",
        "remindersSystemAlertsEnabled",
        "emailEnabled",
        "pushEnabled",
        "smsEnabled",
    ]),
    enabled: z.boolean(),
});

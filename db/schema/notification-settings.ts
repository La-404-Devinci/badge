// notificationSettings.ts
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulid";

import { user } from "./auth-schema";

// Notification methods enum
export const notificationMethodEnum = pgEnum("notification_method", [
    "email",
    "push",
    "sms",
]);

// Notification settings table with reference to user table
export const notificationSettings = pgTable("notification_settings", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),

    // Notification Preferences section - Types of notifications user wants to receive
    newsUpdatesEnabled: boolean("news_updates_enabled").notNull().default(true),
    promotionsOffersEnabled: boolean("promotions_offers_enabled")
        .notNull()
        .default(false),
    remindersSystemAlertsEnabled: boolean("reminders_system_alerts_enabled")
        .notNull()
        .default(true),

    // Notification Methods section - How user wants to receive notifications
    emailEnabled: boolean("email_enabled").notNull().default(true),
    pushEnabled: boolean("push_enabled").notNull().default(true),
    smsEnabled: boolean("sms_enabled").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports
export type NotificationSettings = typeof notificationSettings.$inferSelect;

export const notificationSettingsSchema = createInsertSchema(
    notificationSettings
).omit({
    userId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
});

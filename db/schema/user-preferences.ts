import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulid";

import { user } from "./auth-schema";

export const timeFormatEnum = pgEnum("time_format", ["12-hours", "24-hours"]);
export const dateFormatEnum = pgEnum("date_format", [
    "MM/DD/YY",
    "DD/MM/YY",
    "YY/MM/DD",
    "YYYY-MM-DD",
]);

// User preferences table with reference to user table
export const userPreferences = pgTable("user_preferences", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),
    language: text("language").notNull().default("en-US"),
    timezone: text("timezone").notNull().default("GMT+01:00"),
    timeFormat: timeFormatEnum("time_format").default("24-hours"),
    dateFormat: dateFormatEnum("date_format").default("DD/MM/YY"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports
export type UserPreferences = typeof userPreferences.$inferSelect;

export const userPreferencesSchema = createInsertSchema(userPreferences).omit({
    userId: true,
    id: true,
});

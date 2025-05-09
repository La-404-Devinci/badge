// notificationSettings.ts
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulid";

import { user } from "./auth-schema";

export const projectTypeEnum = pgEnum("project_type", [
    "uxui",
    "dev",
    "marketing",
    "other",
]);

export type ProjectType = (typeof projectTypeEnum.enumValues)[number];
export const project = pgTable("project", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: projectTypeEnum("type").notNull(),
    exclusive404: boolean("exclusive404").notNull().default(false),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    badgeName: text("badge_name").notNull(),
    badgeUrl: text("badge_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports
export type Project = typeof project.$inferSelect;

export const projectSchema = createInsertSchema(project).omit({
    userId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
});

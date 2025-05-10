// project.ts
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

export const projectStatusEnum = pgEnum("project_status", [
    "review",
    "active",
    "inactive",
    "completed",
    "cancelled",
]);

export const projectSkillStatusEnum = pgEnum("project_skill_status", [
    "review",
    "active",
    "inactive",
]);

export type ProjectType = (typeof projectTypeEnum.enumValues)[number];
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export const project = pgTable("project", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: projectTypeEnum("type").notNull(),
    exclusive404: boolean("exclusive404").notNull().default(false),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    badgeName: text("badge_name").notNull(),
    badgeImage: text("badge_image").notNull(),
    skills: text("skills").array(),
    status: projectStatusEnum("status").notNull().default("review"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports
export type Project = typeof project.$inferSelect;
export type ProjectContributor = typeof projectContributor.$inferSelect;

export const projectSchema = createInsertSchema(project).omit({
    userId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const projectContributor = pgTable("project_contributor", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    projectId: text("project_id")
        .notNull()
        .references(() => project.id),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectSkill = pgTable("project_skill", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),
    name: text("name").notNull(),
    status: projectSkillStatusEnum("status").notNull().default("review"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

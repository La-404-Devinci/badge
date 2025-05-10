import {
    pgTable,
    text,
    timestamp,
    jsonb,
    varchar,
    boolean,
    date,
    pgEnum,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";

import { user } from "./auth-schema";

export const exerciceStatusEnum = pgEnum("exercice_status", [
    "draft",
    "published",
    "archived",
]);

export const exercice = pgTable("exercice", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    // Metadata
    title: varchar("title", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 255 }).notNull(),

    // Problem statement
    problem: text("problem").notNull(),
    hints: jsonb("hints").$type<string[]>().notNull().default([]),
    response: text("response").notNull(),
    exampleInputs: jsonb("example_inputs").$type<string[]>().notNull(),
    validationInputs: jsonb("validation_inputs").$type<string[]>().notNull(),

    // Outputs (generated on publish)
    exampleOutputs: jsonb("example_outputs").$type<string[]>(),
    validationOutputs: jsonb("validation_outputs").$type<string[]>(),

    // Difficulty
    difficulty: varchar("difficulty", { length: 50 }).default("medium"),

    // Daily challenge
    status: exerciceStatusEnum("status").default("draft"),
    dailyChallengeDate: date("daily_challenge_date"),

    // Tracking
    systemCreated: boolean("system_created").default(false),
    createdBy: text("created_by").references(() => user.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Exercice = typeof exercice.$inferSelect;

export type PublicExercice = Pick<
    Exercice,
    | "id"
    | "title"
    | "description"
    | "problem"
    | "exampleInputs"
    | "exampleOutputs"
    | "difficulty"
>;

import {
    pgTable,
    text,
    timestamp,
    jsonb,
    varchar,
    boolean,
    date,
    pgEnum,
    integer,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";

import { user } from "./auth-schema";

export const exerciseStatusEnum = pgEnum("exercise_status", [
    "draft",
    "published",
    "archived",
]);

export const exercise = pgTable("exercise", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    // Metadata
    title: varchar("title", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 255 }).notNull(),
    score: integer("score").notNull(),

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
    status: exerciseStatusEnum("status").default("draft"),
    dailyChallengeDate: date("daily_challenge_date"),

    // Tracking
    systemCreated: boolean("system_created").default(false),
    createdBy: text("created_by").references(() => user.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Exercise = typeof exercise.$inferSelect;

export type PublicExercise = Pick<
    Exercise,
    | "id"
    | "title"
    | "description"
    | "problem"
    | "exampleInputs"
    | "exampleOutputs"
    | "difficulty"
>;

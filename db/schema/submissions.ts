import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

import { user } from "./auth-schema";
import { exercice } from "./exercices";

export const submission = pgTable("submission", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    // Relations
    userId: text("user_id")
        .notNull()
        .references(() => user.id, {
            onDelete: "cascade",
        }),
    exerciceId: text("exercice_id")
        .notNull()
        .references(() => exercice.id, {
            onDelete: "cascade",
        }),

    // Submission data
    submittedCode: text("submitted_code").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    isStreak: boolean("is_streak").notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Submission = typeof submission.$inferSelect;
export type InsertSubmission = typeof submission.$inferInsert;

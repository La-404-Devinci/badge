import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

import { user } from "./auth-schema";
import { project } from "./project";

// Table des types de badges disponibles
export const badgeType = pgTable("badge_type", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    name: text("name").notNull().unique(), // ex: "daily", "project", "streak"
    displayName: text("display_name").notNull(), // ex: "Défi Quotidien", "Projet", "Série"
    description: text("description").notNull(),
    image: text("image").notNull(), // URL de l'image du badge (obligatoire)
    color: text("color").notNull(), // couleur du badge
    maxLevel: integer("max_level").notNull().default(100),

    // Configuration de l'expérience
    baseExp: integer("base_exp").notNull().default(100), // exp de base pour le niveau 1
    expMultiplier: integer("exp_multiplier").notNull().default(1), // multiplicateur d'exp par niveau

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table des badges des utilisateurs (progression individuelle)
export const userBadge = pgTable("user_badge", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    badgeTypeId: text("badge_type_id")
        .notNull()
        .references(() => badgeType.id, { onDelete: "cascade" }),

    // Progression du badge
    currentLevel: integer("current_level").notNull().default(1),
    currentExp: integer("current_exp").notNull().default(0),
    totalExp: integer("total_exp").notNull().default(0),

    // Calculé: exp nécessaire pour le prochain niveau
    expToNextLevel: integer("exp_to_next_level").notNull().default(100),

    // Dernière mise à jour
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table des récompenses de badges pour les projets
export const projectBadgeReward = pgTable("project_badge_reward", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    projectId: text("project_id")
        .notNull()
        .references(() => project.id, { onDelete: "cascade" }),
    badgeTypeId: text("badge_type_id")
        .notNull()
        .references(() => badgeType.id, { onDelete: "cascade" }),

    // Expérience gagnée lors de la complétion du projet
    expReward: integer("exp_reward").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table des gains d'expérience (historique)
export const expGain = pgTable("exp_gain", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => ulid()),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    badgeTypeId: text("badge_type_id")
        .notNull()
        .references(() => badgeType.id, { onDelete: "cascade" }),

    // Source de l'expérience
    sourceType: text("source_type").notNull(), // "daily_challenge", "project_completion", "streak", etc.
    sourceId: text("source_id"), // ID de la source (ex: exercise_id, project_id)

    // Détails du gain
    expAmount: integer("exp_amount").notNull(),
    previousLevel: integer("previous_level").notNull(),
    newLevel: integer("new_level").notNull(),

    // Métadonnées
    description: text("description"), // description du gain d'exp
    metadata: text("metadata"), // données JSON supplémentaires

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types d'export
export type BadgeType = typeof badgeType.$inferSelect;
export type InsertBadgeType = typeof badgeType.$inferInsert;

export type UserBadge = typeof userBadge.$inferSelect;
export type InsertUserBadge = typeof userBadge.$inferInsert;

export type ProjectBadgeReward = typeof projectBadgeReward.$inferSelect;
export type InsertProjectBadgeReward = typeof projectBadgeReward.$inferInsert;

export type ExpGain = typeof expGain.$inferSelect;
export type InsertExpGain = typeof expGain.$inferInsert;

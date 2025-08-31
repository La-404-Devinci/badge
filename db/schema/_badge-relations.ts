import { relations } from "drizzle-orm";

import { user } from "./auth-schema";
import { project } from "./project";
import { badgeType, userBadge, projectBadgeReward, expGain } from "./badges";

// Relations pour badgeType
export const badgeTypeRelations = relations(badgeType, ({ many }) => ({
    userBadges: many(userBadge),
    projectRewards: many(projectBadgeReward),
    expGains: many(expGain),
}));

// Relations pour userBadge
export const userBadgeRelations = relations(userBadge, ({ one }) => ({
    user: one(user, {
        fields: [userBadge.userId],
        references: [user.id],
    }),
    badgeType: one(badgeType, {
        fields: [userBadge.badgeTypeId],
        references: [badgeType.id],
    }),
}));

// Relations pour projectBadgeReward
export const projectBadgeRewardRelations = relations(
    projectBadgeReward,
    ({ one }) => ({
        project: one(project, {
            fields: [projectBadgeReward.projectId],
            references: [project.id],
        }),
        badgeType: one(badgeType, {
            fields: [projectBadgeReward.badgeTypeId],
            references: [badgeType.id],
        }),
    })
);

// Relations pour expGain
export const expGainRelations = relations(expGain, ({ one }) => ({
    user: one(user, {
        fields: [expGain.userId],
        references: [user.id],
    }),
    badgeType: one(badgeType, {
        fields: [expGain.badgeTypeId],
        references: [badgeType.id],
    }),
}));

// Relations pour user (ajout des badges)
export const userBadgeUserRelations = relations(user, ({ many }) => ({
    badges: many(userBadge),
    expGains: many(expGain),
}));

// Relations pour project (ajout des récompenses de badges)
export const projectBadgeProjectRelations = relations(project, ({ many }) => ({
    badgeRewards: many(projectBadgeReward),
}));

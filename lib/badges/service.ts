import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { badgeType, userBadge, projectBadgeReward, expGain } from "@/db/schema";

export class BadgeService {
    /**
     * Calcule l'expérience nécessaire pour le prochain niveau
     */
    static calculateExpForLevel(
        level: number,
        baseExp: number,
        multiplier: number = 1
    ): number {
        return Math.floor(baseExp * Math.pow(level, multiplier));
    }

    /**
     * Calcule le niveau actuel basé sur l'expérience totale
     */
    static calculateLevelFromExp(
        totalExp: number,
        baseExp: number,
        multiplier: number = 1
    ): number {
        let level = 1;
        let expNeeded = 0;

        while (expNeeded <= totalExp) {
            level++;
            expNeeded += this.calculateExpForLevel(level, baseExp, multiplier);
        }

        return level - 1;
    }

    /**
     * Obtient ou crée un badge utilisateur
     */
    static async getUserBadge(userId: string, badgeTypeName: string) {
        // Trouver le type de badge
        const badgeTypeData = await db.query.badgeType.findFirst({
            where: eq(badgeType.name, badgeTypeName),
        });

        if (!badgeTypeData) {
            throw new Error(`Type de badge '${badgeTypeName}' non trouvé`);
        }

        // Trouver ou créer le badge utilisateur
        let userBadgeData = await db.query.userBadge.findFirst({
            where: and(
                eq(userBadge.userId, userId),
                eq(userBadge.badgeTypeId, badgeTypeData.id)
            ),
        });

        if (!userBadgeData) {
            // Créer un nouveau badge utilisateur
            const [newUserBadge] = await db
                .insert(userBadge)
                .values({
                    userId,
                    badgeTypeId: badgeTypeData.id,
                    currentLevel: 1,
                    currentExp: 0,
                    totalExp: 0,
                    expToNextLevel: this.calculateExpForLevel(
                        2,
                        badgeTypeData.baseExp,
                        badgeTypeData.expMultiplier
                    ),
                })
                .returning();

            userBadgeData = newUserBadge;
        }

        return { userBadge: userBadgeData, badgeType: badgeTypeData };
    }

    /**
     * Ajoute de l'expérience à un badge utilisateur
     */
    static async addExperience(
        userId: string,
        badgeTypeName: string,
        expAmount: number,
        sourceType: string,
        sourceId?: string,
        description?: string
    ) {
        const { userBadge: userBadgeData, badgeType } = await this.getUserBadge(
            userId,
            badgeTypeName
        );

        const previousLevel = userBadgeData.currentLevel;
        const newTotalExp = userBadgeData.totalExp + expAmount;

        // Calculer le nouveau niveau
        const newLevel = this.calculateLevelFromExp(
            newTotalExp,
            badgeType.baseExp,
            badgeType.expMultiplier
        );

        // Calculer l'expérience pour le prochain niveau
        const expToNextLevel = this.calculateExpForLevel(
            newLevel + 1,
            badgeType.baseExp,
            badgeType.expMultiplier
        );

        // Mettre à jour le badge utilisateur
        const [updatedUserBadge] = await db
            .update(userBadge)
            .set({
                currentLevel: newLevel,
                currentExp:
                    newTotalExp -
                    this.calculateExpForLevel(
                        newLevel,
                        badgeType.baseExp,
                        badgeType.expMultiplier
                    ),
                totalExp: newTotalExp,
                expToNextLevel,
                lastUpdated: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(userBadge.id, userBadgeData.id))
            .returning();

        // Enregistrer le gain d'expérience
        await db.insert(expGain).values({
            userId,
            badgeTypeId: badgeType.id,
            sourceType,
            sourceId,
            expAmount,
            previousLevel,
            newLevel,
            description,
        });

        return {
            userBadge: updatedUserBadge,
            levelUp: newLevel > previousLevel,
            previousLevel,
            newLevel,
            expGained: expAmount,
        };
    }

    /**
     * Obtient tous les badges d'un utilisateur
     */
    static async getUserBadges(userId: string) {
        return await db.query.userBadge.findMany({
            where: eq(userBadge.userId, userId),
            with: {
                badgeType: true,
            },
        });
    }

    /**
     * Obtient les récompenses de badges pour un projet
     */
    static async getProjectBadgeRewards(projectId: string) {
        return await db.query.projectBadgeReward.findMany({
            where: eq(projectBadgeReward.projectId, projectId),
            with: {
                badgeType: true,
            },
        });
    }

    /**
     * Ajoute des récompenses de badges à un projet
     */
    static async addProjectBadgeRewards(
        projectId: string,
        rewards: Array<{ badgeTypeName: string; expReward: number }>
    ) {
        const badgeRewards = [];

        for (const reward of rewards) {
            const badgeTypeData = await db.query.badgeType.findFirst({
                where: eq(badgeType.name, reward.badgeTypeName),
            });

            if (!badgeTypeData) {
                throw new Error(
                    `Type de badge '${reward.badgeTypeName}' non trouvé`
                );
            }

            const [badgeReward] = await db
                .insert(projectBadgeReward)
                .values({
                    projectId,
                    badgeTypeId: badgeTypeData.id,
                    expReward: reward.expReward,
                })
                .returning();

            badgeRewards.push(badgeReward);
        }

        return badgeRewards;
    }

    /**
     * Attribue les récompenses de badges lors de la complétion d'un projet
     */
    static async awardProjectBadges(userId: string, projectId: string) {
        const rewards = await this.getProjectBadgeRewards(projectId);
        const results = [];

        for (const reward of rewards) {
            const result = await this.addExperience(
                userId,
                reward.badgeType.name,
                reward.expReward,
                "project_completion",
                projectId,
                `Complétion du projet ${projectId}`
            );
            results.push(result);
        }

        return results;
    }

    /**
     * Obtient l'historique des gains d'expérience d'un utilisateur
     */
    static async getUserExpHistory(userId: string, limit: number = 50) {
        return await db.query.expGain.findMany({
            where: eq(expGain.userId, userId),
            with: {
                badgeType: true,
            },
            orderBy: sql`${expGain.createdAt} DESC`,
            limit,
        });
    }
}

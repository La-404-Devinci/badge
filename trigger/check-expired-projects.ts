import { task } from "@trigger.dev/sdk/v3";
import { and, eq, lt, ne } from "drizzle-orm";

import { db } from "@/db";
import {
    project,
    projectContributor,
    projectBadgeReward,
    badgeType,
} from "@/db/schema";
import { BadgeService } from "@/lib/badges/service";

export const checkExpiredProjects = task({
    id: "check-expired-projects",
    description:
        "Check for projects that have passed their end date and mark them as completed",

    run: async () => {
        const now = new Date();

        // Find all projects that have passed their end date and are not already completed or cancelled
        const expiredProjects = await db
            .select()
            .from(project)
            .where(
                and(
                    lt(project.endDate, now),
                    ne(project.status, "completed"),
                    ne(project.status, "cancelled")
                )
            );

        console.log(
            `Found ${expiredProjects.length} expired projects to process`
        );

        const results = [];

        for (const expiredProject of expiredProjects) {
            try {
                // Update project status to completed
                const [updatedProject] = await db
                    .update(project)
                    .set({
                        status: "completed",
                        updatedAt: new Date(),
                    })
                    .where(eq(project.id, expiredProject.id))
                    .returning();

                console.log(
                    `Updated project ${expiredProject.title} (${expiredProject.id}) to completed status`
                );

                // Get all contributors for this project
                const contributors = await db
                    .select()
                    .from(projectContributor)
                    .where(eq(projectContributor.projectId, expiredProject.id));

                // Determine who should receive experience
                const usersToReward = expiredProject.exclusive404
                    ? [{ userId: expiredProject.userId }] // Award to project creator
                    : contributors; // Award to contributors

                // Award experience to all users
                const expResults = [];
                for (const user of usersToReward) {
                    try {
                        // Get project badge rewards
                        const badgeRewards = await db
                            .select()
                            .from(projectBadgeReward)
                            .where(
                                eq(
                                    projectBadgeReward.projectId,
                                    expiredProject.id
                                )
                            );

                        // Award experience for each badge reward
                        for (const badgeReward of badgeRewards) {
                            const [badgeTypeData] = await db
                                .select()
                                .from(badgeType)
                                .where(
                                    eq(badgeType.id, badgeReward.badgeTypeId)
                                )
                                .limit(1);

                            if (badgeTypeData) {
                                const expResult =
                                    await BadgeService.addExperience(
                                        user.userId,
                                        badgeTypeData.name,
                                        badgeReward.expReward,
                                        "project_completion",
                                        expiredProject.id,
                                        `Projet terminé: ${expiredProject.title}`
                                    );

                                expResults.push({
                                    userId: user.userId,
                                    badgeType: badgeTypeData.name,
                                    expGained: expResult.expGained,
                                    levelUp: expResult.levelUp,
                                    previousLevel: expResult.previousLevel,
                                    newLevel: expResult.newLevel,
                                });

                                console.log(
                                    `Awarded ${expResult.expGained} exp to user ${user.userId} for badge ${badgeTypeData.name}`
                                );
                            }
                        }
                    } catch (error) {
                        console.error(
                            `Error awarding experience to user ${user.userId}:`,
                            error
                        );
                    }
                }

                results.push({
                    projectId: expiredProject.id,
                    projectTitle: expiredProject.title,
                    contributorsCount: contributors.length,
                    expResults,
                    success: true,
                });
            } catch (error) {
                console.error(
                    `Error processing expired project ${expiredProject.id}:`,
                    error
                );
                results.push({
                    projectId: expiredProject.id,
                    projectTitle: expiredProject.title,
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                });
            }
        }

        return {
            processedProjects: results.length,
            successfulUpdates: results.filter((r) => r.success).length,
            failedUpdates: results.filter((r) => !r.success).length,
            results,
        };
    },
});

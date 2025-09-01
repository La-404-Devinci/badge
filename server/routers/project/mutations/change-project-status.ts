import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import {
    project,
    projectContributor,
    projectBadgeReward,
    ProjectStatus,
} from "@/db/schema";
import { badgeType } from "@/db/schema/badges";
import { BadgeService } from "@/lib/badges/service";

import type { ChangeProjectStatusInput, ProjectMutationContext } from "./types";

export async function changeProjectStatus({
    db,
    session,
    input,
}: ProjectMutationContext<ChangeProjectStatusInput>) {
    try {
        // First, get the current project to check its status
        const [currentProject] = await db
            .select()
            .from(project)
            .where(eq(project.id, input.projectId))
            .limit(1);

        if (!currentProject) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Projet non trouvé",
            });
        }

        // Prevent modification of completed projects
        if (currentProject.status === "completed") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Impossible de modifier un projet terminé",
            });
        }

        // Update project status
        const [updatedProject] = await db
            .update(project)
            .set({
                status: input.status as ProjectStatus,
                updatedAt: new Date(),
            })
            .where(eq(project.id, input.projectId))
            .returning();

        // If status is being changed to "completed", award experience to contributors
        if (input.status === "completed") {
            console.log(
                `Awarding experience for project ${currentProject.title} (${input.projectId})`
            );

            // Get all badge rewards for this project
            const badgeRewards = await db
                .select()
                .from(projectBadgeReward)
                .where(eq(projectBadgeReward.projectId, input.projectId));

            console.log(
                `Found ${badgeRewards.length} badge rewards for project`
            );

            // Get contributors if project is not exclusive to 404
            const contributors = await db
                .select()
                .from(projectContributor)
                .where(eq(projectContributor.projectId, input.projectId));

            // Determine who should receive experience
            const usersToReward = currentProject.exclusive404
                ? [{ userId: currentProject.userId }] // Award to project creator
                : contributors; // Award to contributors

            console.log(
                `Project exclusive404: ${currentProject.exclusive404}, users to reward: ${usersToReward.length}`
            );

            // Award experience to each user for each badge reward
            for (const user of usersToReward) {
                for (const reward of badgeRewards) {
                    try {
                        // Get the badge type name
                        const [badgeTypeData] = await db
                            .select()
                            .from(badgeType)
                            .where(eq(badgeType.id, reward.badgeTypeId))
                            .limit(1);

                        if (badgeTypeData) {
                            console.log(
                                `Awarding ${reward.expReward} exp to user ${user.userId} for badge ${badgeTypeData.name}`
                            );

                            const result = await BadgeService.addExperience(
                                user.userId,
                                badgeTypeData.name,
                                reward.expReward,
                                "project_completion",
                                input.projectId,
                                `Projet terminé: ${currentProject.title}`
                            );

                            console.log(`Successfully awarded experience:`, {
                                userId: user.userId,
                                badgeName: badgeTypeData.name,
                                expGained: result.expGained,
                                levelUp: result.levelUp,
                                previousLevel: result.previousLevel,
                                newLevel: result.newLevel,
                            });
                        } else {
                            console.error(
                                `Badge type not found for ID: ${reward.badgeTypeId}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error awarding experience to user ${user.userId} for reward ${reward.id}:`,
                            error
                        );
                        throw error; // Re-throw to stop the process
                    }
                }
            }
        }

        return { success: true, data: updatedProject };
    } catch (error) {
        console.error("Error changing project status:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to change project status",
        });
    }
}

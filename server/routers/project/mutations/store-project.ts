import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import { project, projectContributor, ProjectType } from "@/db/schema";
import { projectBadgeReward } from "@/db/schema/badges";

import type { StoreProjectInput, ProjectMutationContext } from "./types";

export async function storeProject({
    db,
    session,
    input,
}: ProjectMutationContext<StoreProjectInput>) {
    const userId = session.user.id;

    try {
        // First, check if project exists for the user
        const [existingProject] = await db
            .select({ id: project.id })
            .from(project)
            .where(
                and(eq(project.userId, userId), eq(project.title, input.title))
            );

        if (existingProject) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Un projet avec ce titre existe déjà",
            });
        }

        // Create new project
        const [newProject] = await db
            .insert(project)
            .values({
                title: input.title,
                description: input.description,
                type: input.type as ProjectType,
                exclusive404: input.exclusive404,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                skills: input.skills,
                userId,
            })
            .returning();

        // Create badge reward if provided
        if (input.badgeTypeId && input.expReward) {
            await db.insert(projectBadgeReward).values({
                projectId: newProject.id,
                badgeTypeId: input.badgeTypeId,
                expReward: input.expReward,
            });
        }

        // Create contributors if provided and project is not exclusive to 404
        if (
            input.contributors &&
            input.contributors.length > 0 &&
            !input.exclusive404
        ) {
            const contributorValues = input.contributors.map(
                (contributorId) => ({
                    projectId: newProject.id,
                    userId: contributorId,
                })
            );

            await db.insert(projectContributor).values(contributorValues);
        }

        return { success: true, data: newProject };
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

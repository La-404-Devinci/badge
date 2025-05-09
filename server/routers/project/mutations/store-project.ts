import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project, ProjectType } from "@/db/schema";

import type { CreateProjectInput, ProjectMutationContext } from "./types";

export async function storeProject({
    db,
    session,
    input,
}: ProjectMutationContext<CreateProjectInput>) {
    const userId = session.user.id;

    try {
        // First, check if project exists for the user
        const [existingProject] = await db
            .select({ id: project.id })
            .from(project)
            .where(eq(project.userId, userId));

        if (!existingProject) {
            // If not, create new project
            const [newProject] = await db
                .insert(project)
                .values({
                    ...input,
                    type: input.type as ProjectType,
                    startDate: new Date(input.startDate),
                    endDate: new Date(input.endDate),
                    userId,
                })
                .returning();

            return { success: true, data: newProject };
        } else {
            // If yes, update existing project
            const [updatedProject] = await db
                .update(project)
                .set({
                    ...input,
                    type: input.type as ProjectType,
                    startDate: new Date(input.startDate),
                    endDate: new Date(input.endDate),
                    updatedAt: new Date(),
                })
                .where(eq(project.userId, userId))
                .returning();

            return { success: true, data: updatedProject };
        }
    } catch (error) {
        console.error("Error updating project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update project",
        });
    }
}

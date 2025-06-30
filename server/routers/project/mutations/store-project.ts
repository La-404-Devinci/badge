import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import { project, ProjectType } from "@/db/schema";

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
        }

        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Project already exists",
        });
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

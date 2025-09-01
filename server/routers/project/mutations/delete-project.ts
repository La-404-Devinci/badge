import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project } from "@/db/schema";

import type { DeleteProjectInput, DeleteProjectMutationContext } from "./types";

export async function deleteProject({
    db,
    input,
}: DeleteProjectMutationContext<DeleteProjectInput>) {
    try {
        const { projectId } = input;

        // First, get the current project to check its status
        const [currentProject] = await db
            .select()
            .from(project)
            .where(eq(project.id, projectId))
            .limit(1);

        if (!currentProject) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        // Prevent deletion of completed projects
        if (currentProject.status === "completed") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Impossible de supprimer un projet terminé",
            });
        }

        // Delete project
        const deletedProject = await db
            .delete(project)
            .where(eq(project.id, projectId))
            .returning();

        return {
            success: true,
            data: deletedProject[0],
        };
    } catch (error) {
        console.error("Error deleting project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete project",
        });
    }
}

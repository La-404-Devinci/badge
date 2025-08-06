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

        // Delete project
        const deletedProject = await db
            .delete(project)
            .where(eq(project.id, projectId))
            .returning();

        if (!deletedProject || deletedProject.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

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

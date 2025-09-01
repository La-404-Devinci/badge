import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project } from "@/db/schema";

import type { RejectProjectInput, RejectProjectMutationContext } from "./types";

export async function rejectProject({
    db,
    input,
}: RejectProjectMutationContext<RejectProjectInput>) {
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

        // Prevent modification of completed projects
        if (currentProject.status === "completed") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Impossible de modifier un projet terminé",
            });
        }

        // Update project status to cancelled
        const updatedProject = await db
            .update(project)
            .set({
                status: "cancelled",
                updatedAt: new Date(),
            })
            .where(eq(project.id, projectId))
            .returning();

        return {
            success: true,
            data: updatedProject[0],
        };
    } catch (error) {
        console.error("Error rejecting project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reject project",
        });
    }
}

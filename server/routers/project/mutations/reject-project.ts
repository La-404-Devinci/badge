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

        // Update project status to cancelled
        const updatedProject = await db
            .update(project)
            .set({
                status: "cancelled",
                updatedAt: new Date(),
            })
            .where(eq(project.id, projectId))
            .returning();

        if (!updatedProject || updatedProject.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

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

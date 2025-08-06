import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project } from "@/db/schema";

import type { AcceptProjectInput, AcceptProjectMutationContext } from "./types";

export async function acceptProject({
    db,
    input,
}: AcceptProjectMutationContext<AcceptProjectInput>) {
    try {
        const { projectId } = input;

        // Update project status to active
        const updatedProject = await db
            .update(project)
            .set({
                status: "active",
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
        console.error("Error accepting project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to accept project",
        });
    }
}

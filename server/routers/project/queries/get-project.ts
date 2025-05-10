import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project, projectContributor } from "@/db/schema";

import type { GetProjectQueryContext } from "./types";

export async function getProject({ db }: GetProjectQueryContext) {
    try {
        const getProject = await db
            .select()
            .from(project)
            .leftJoin(
                projectContributor,
                eq(projectContributor.projectId, project.id)
            );

        console.log(getProject);
        return { success: true, data: getProject };
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { project, projectStatusEnum } from "@/db/schema";

import type { GetProjectsQueryContext } from "./types";

export async function getProjects({ db }: GetProjectsQueryContext) {
    try {
        const getProjects = await db
            .select()
            .from(project)
            .where(eq(project.status, projectStatusEnum.enumValues[1]));

        return { success: true, data: getProjects };
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

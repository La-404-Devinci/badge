import { TRPCError } from "@trpc/server";
import { eq, and, inArray } from "drizzle-orm";

import { project, projectStatusEnum, projectContributor } from "@/db/schema";

import type { GetProjectsQueryContext } from "./types";

export async function getContributorProjects({
    db,
    userId,
}: GetProjectsQueryContext) {
    try {
        const contributedProjectIds = await db
            .select({ projectId: projectContributor.projectId })
            .from(projectContributor)
            .where(eq(projectContributor.userId, userId));

        const includedIds = contributedProjectIds.map((p) => p.projectId);

        const getProjects = await db.query.project.findMany({
            where: and(
                eq(project.status, projectStatusEnum.enumValues[1]),
                inArray(project.id, includedIds)
            ),
            with: {
                projectContributors: {
                    with: {
                        user: true,
                    },
                },
            },
        });
        return { success: true, data: getProjects };
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch projects",
        });
    }
}

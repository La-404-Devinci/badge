import { TRPCError } from "@trpc/server";
import { eq, and, notInArray } from "drizzle-orm";

import { project, projectStatusEnum, projectContributor } from "@/db/schema";

import type { GetProjectsQueryContext } from "./types";

export async function getProjects({ db, userId }: GetProjectsQueryContext) {
    try {
        const contributedProjectIds = await db
            .select({ projectId: projectContributor.projectId })
            .from(projectContributor)
            .where(eq(projectContributor.userId, userId));

        const excludedIds = contributedProjectIds.map((p) => p.projectId);

        const getProjects = await db.query.project.findMany({
            where: and(
                eq(project.status, projectStatusEnum.enumValues[1]),
                notInArray(project.id, excludedIds)
            ),
            with: {
                projectContributors: {
                    columns: {
                        id: true,
                        userId: true,
                    },
                    with: {
                        user: {
                            columns: {
                                id: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return { success: true, data: getProjects };
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

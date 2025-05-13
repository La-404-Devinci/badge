import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { project, projectStatusEnum } from "@/db/schema";

import type { GetProjectQueryContext } from "./types";

export async function getProject({ db, input }: GetProjectQueryContext) {
    try {
        const [getProject] = await db.query.project.findMany({
            where: and(
                eq(project.id, input.projectId),
                eq(project.status, projectStatusEnum.enumValues[1])
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
                                role: true,
                                position: true,
                            },
                        },
                    },
                },
            },
        });
        return { success: true, data: getProject };
    } catch (error) {
        console.error("Error storing project:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store project",
        });
    }
}

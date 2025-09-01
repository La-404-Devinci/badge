import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    storeProject,
    acceptProject,
    rejectProject,
    deleteProject,
    changeProjectStatus,
} from "./mutations/index";
import { getProjects } from "./queries/get-projects";
import { listAdminProjects } from "./queries/list-admin-projects";
import { storeProjectSchema, listAdminProjectsSchema } from "./validators";
import {
    acceptProjectSchema,
    rejectProjectSchema,
    deleteProjectSchema,
    changeProjectStatusSchema,
} from "./mutations/types";

// Project router
export const projectRouter = router({
    // Mutations
    storeProject: protectedProcedure
        .input(storeProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeProject({ db, session, input });
        }),

    acceptProject: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(acceptProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await acceptProject({ db, session, input });
        }),

    rejectProject: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(rejectProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await rejectProject({ db, session, input });
        }),

    deleteProject: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(deleteProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await deleteProject({ db, session, input });
        }),

    changeProjectStatus: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(changeProjectStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await changeProjectStatus({ db, session, input });
        }),

    // Queries
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        const userId = session.user.id;
        return await getProjects({ db, userId, session });
    }),

    listAdminProjects: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(listAdminProjectsSchema)
        .query(async ({ ctx, input }) => {
            const { db } = ctx;
            return await listAdminProjects({ input, db });
        }),
});

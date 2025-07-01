import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    storeProject,
    storeContributor,
    deleteContributor,
} from "./mutations/index";
import {
    getProjects,
    getContributorProjects,
    getProject,
} from "./queries/index";
import {
    storeProjectSchema,
    storeContributorSchema,
    getProjectSchema,
} from "./validators";
// Project router
export const projectRouter = router({
    // Mutations
    storeProject: protectedProcedure
        .input(storeProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeProject({ db, session, input });
        }),

    storeContributor: protectedProcedure
        .input(storeContributorSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeContributor({ db, session, input });
        }),

    deleteContributor: protectedProcedure
        .input(storeContributorSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await deleteContributor({ db, session, input });
        }),

    // Queries
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        const userId = session.user.id;
        return await getProjects({ db, userId, session });
    }),

    getContributorProjects: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        const userId = session.user.id;
        return await getContributorProjects({ db, userId, session });
    }),

    getProject: protectedProcedure
        .input(getProjectSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await getProject({ db, input, session });
        }),
});

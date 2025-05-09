import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { storeProject } from "./mutations/index";
import { createProjectSchema } from "./validators";

// Project  router
export const projectRouter = router({
    // Mutations
    createProject: protectedProcedure
        .input(createProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeProject({ db, session, input });
        }),
});

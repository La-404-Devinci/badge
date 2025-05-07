import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    batchDeleteExercices,
    batchUpdateExerciceStatus,
    deleteExercice,
    generateExercice,
    updateExerciceStatus,
} from "./mutations/index";
import { listExercices } from "./queries/index";
import {
    batchDeleteExercicesSchema,
    batchUpdateExerciceStatusSchema,
    deleteExerciceSchema,
    listExercicesSchema,
    updateExerciceStatusSchema,
} from "./validators";

export const exerciceRouter = router({
    // Queries
    listExercices: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(listExercicesSchema)
        .query(async ({ ctx, input }) => {
            const { db } = ctx;
            return await listExercices({ input, db });
        }),

    // Mutations
    updateExerciceStatus: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(updateExerciceStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await updateExerciceStatus({ input, db });
        }),

    deleteExercice: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(deleteExerciceSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await deleteExercice({ input, db });
        }),

    batchUpdateExerciceStatus: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(batchUpdateExerciceStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await batchUpdateExerciceStatus({ input, db });
        }),

    batchDeleteExercices: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(batchDeleteExercicesSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await batchDeleteExercices({ input, db });
        }),

    generateExercice: protectedProcedure
        .meta({ roles: ["admin"] })
        .mutation(async ({ ctx }) => {
            const { db, session } = ctx;
            return await generateExercice({ db, input: session.user.id });
        }),
});

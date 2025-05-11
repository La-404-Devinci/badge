import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    batchDeleteExercices,
    batchUpdateExerciceStatus,
    deleteExercice,
    executeCode,
    generateExercice,
    submitExercice,
    updateExercice,
    updateExerciceStatus,
} from "./mutations/index";
import {
    listAdminExercices,
    getAdminExercice,
    listGenerateQueue,
    getChallenge,
    getUserStreak,
} from "./queries/index";
import {
    batchDeleteExercicesSchema,
    batchUpdateExerciceStatusSchema,
    deleteExerciceSchema,
    executeCodeSchema,
    getAdminExerciceSchema,
    listAdminExercicesSchema,
    updateExerciceSchema,
    updateExerciceStatusSchema,
    getChallengeSchema,
    submitExerciceSchema,
    getUserStreakSchema,
} from "./validators";

export const exerciceRouter = router({
    // Queries
    getAdminExercice: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(getAdminExerciceSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await getAdminExercice({ input, db, session });
        }),

    listAdminExercices: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(listAdminExercicesSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await listAdminExercices({ input, db, session });
        }),

    listGenerateQueue: protectedProcedure
        .meta({ roles: ["admin"] })
        .query(async () => {
            return await listGenerateQueue();
        }),

    getChallenge: protectedProcedure
        .input(getChallengeSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await getChallenge({ input, db, session });
        }),

    getUserStreak: protectedProcedure
        .input(getUserStreakSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await getUserStreak({
                db,
                input,
                session,
            });
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

    executeCode: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(executeCodeSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await executeCode({ input, db });
        }),

    updateExercice: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(updateExerciceSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await updateExercice({ input, db });
        }),

    submitExercice: protectedProcedure
        .input(submitExerciceSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await submitExercice({
                input,
                db,
                session,
            });
        }),
});

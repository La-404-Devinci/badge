import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    batchDeleteExercises,
    batchUpdateExerciseStatus,
    deleteExercise,
    executeCode,
    generateExercise,
    submitExercise,
    updateExercise,
    updateExerciseStatus,
} from "./mutations/index";
import {
    listAdminExercises,
    getAdminExercise,
    listGenerateQueue,
    getChallenge,
    getUserStreak,
} from "./queries/index";
import {
    batchDeleteExercisesSchema,
    batchUpdateExerciseStatusSchema,
    deleteExerciseSchema,
    executeCodeSchema,
    getAdminExerciseSchema,
    listAdminExercisesSchema,
    updateExerciseSchema,
    updateExerciseStatusSchema,
    getChallengeSchema,
    submitExerciseSchema,
    getUserStreakSchema,
} from "./validators";

export const exerciseRouter = router({
    // Queries
    getAdminExercise: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(getAdminExerciseSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await getAdminExercise({ input, db, session });
        }),

    listAdminExercises: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(listAdminExercisesSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await listAdminExercises({ input, db, session });
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
    updateExerciseStatus: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(updateExerciseStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await updateExerciseStatus({ input, db });
        }),

    deleteExercise: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(deleteExerciseSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await deleteExercise({ input, db });
        }),

    batchUpdateExerciseStatus: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(batchUpdateExerciseStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await batchUpdateExerciseStatus({ input, db });
        }),

    batchDeleteExercises: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(batchDeleteExercisesSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await batchDeleteExercises({ input, db });
        }),

    generateExercise: protectedProcedure
        .meta({ roles: ["admin"] })
        .mutation(async ({ ctx }) => {
            const { db, session } = ctx;
            return await generateExercise({ db, input: session.user.id });
        }),

    executeCode: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(executeCodeSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await executeCode({ input, db });
        }),

    updateExercise: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(updateExerciseSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            return await updateExercise({ input, db });
        }),

    submitExercise: protectedProcedure
        .input(submitExerciseSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await submitExercise({
                input,
                db,
                session,
            });
        }),
});

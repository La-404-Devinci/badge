import { z } from "zod";

export const getAdminExerciseSchema = z.object({
    id: z.string(),
});

export const listAdminExercisesSchema = z.object({
    page: z.number().default(1),
    limit: z.number().min(1).max(100).default(25),
    sortBy: z
        .enum([
            "title",
            "status",
            "difficulty",
            "createdAt",
            "dailyChallengeDate",
        ])
        .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().nullable(),
    status: z.enum(["draft", "published", "archived", "unarchived"]).optional(),
    difficulty: z.enum(["easy", "medium", "hard", "unknown", "all"]).optional(),
});

export const updateExerciseStatusSchema = z.object({
    id: z.string(),
    status: z.enum(["draft", "published", "archived"]),
});

export const deleteExerciseSchema = z.object({
    id: z.string(),
});

export const batchUpdateExerciseStatusSchema = z.object({
    ids: z.array(z.string()).min(1),
    status: z.enum(["draft", "published", "archived"]),
});

export const batchDeleteExercisesSchema = z.object({
    ids: z.array(z.string()).min(1),
});

export const executeCodeSchema = z.object({
    code: z.string().min(1),
    call: z.string().min(1),
});

export const updateExerciseSchema = z.object({
    id: z.string(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(255).optional(),
    problem: z.string().min(1).optional(),
    hints: z.array(z.string()).optional(),
    response: z.string().min(1).optional(),
    exampleInputs: z.array(z.string()).min(1).optional(),
    validationInputs: z.array(z.string()).min(1).optional(),
    difficulty: z.string().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    dailyChallengeDate: z.string().optional(),
    systemCreated: z.boolean().optional(),
});

export const getChallengeSchema = z.object({
    id: z.string(),
});

export const getUserStreakSchema = z.object({
    userId: z.string().optional(),
});

export const submitExerciseSchema = z.object({
    exerciseId: z.string(),
    code: z.string(),
});

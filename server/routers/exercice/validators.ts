import { z } from "zod";

export const getAdminExerciceSchema = z.object({
    id: z.string(),
});

export const listAdminExercicesSchema = z.object({
    page: z.number().default(1),
    limit: z.number().min(1).max(100).default(25),
    sortBy: z
        .enum(["title", "status", "difficulty", "createdAt"])
        .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().nullable(),
    status: z.enum(["draft", "published", "archived", "unarchived"]).optional(),
    difficulty: z.enum(["easy", "medium", "hard", "unknown", "all"]).optional(),
});

export const updateExerciceStatusSchema = z.object({
    id: z.string(),
    status: z.enum(["draft", "published", "archived"]),
});

export const deleteExerciceSchema = z.object({
    id: z.string(),
});

export const batchUpdateExerciceStatusSchema = z.object({
    ids: z.array(z.string()).min(1),
    status: z.enum(["draft", "published", "archived"]),
});

export const batchDeleteExercicesSchema = z.object({
    ids: z.array(z.string()).min(1),
});

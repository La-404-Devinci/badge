import { z } from "zod";

export const storeProjectSchema = z.object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: z
        .string()
        .min(5, "La description doit contenir au moins 5 caractères"),
    type: z.enum(["uxui", "dev", "marketing", "other"]),
    exclusive404: z.boolean().default(false),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    skills: z.array(z.string()).optional(),
    badgeTypeId: z.string().optional(),
    expReward: z
        .number()
        .min(1, "La récompense d'expérience doit être au moins 1")
        .optional(),
    contributors: z.array(z.string()).optional(),
});

export const listAdminProjectsSchema = z.object({
    search: z.string().optional(),
    status: z
        .enum(["all", "review", "active", "inactive", "completed", "cancelled"])
        .optional(),
    type: z.enum(["all", "uxui", "dev", "marketing", "other"]).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export type StoreProjectInput = z.infer<typeof storeProjectSchema>;
export type ListAdminProjectsInput = z.infer<typeof listAdminProjectsSchema>;

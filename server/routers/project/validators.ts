import { z } from "zod";

export const storeProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.string().min(1),
    exclusive404: z.boolean().default(false),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    badgeName: z.string().min(1),
    badgeImage: z.string().url(),
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

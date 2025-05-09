import { z } from "zod";

export const storeProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.string().min(1),
    exclusive404: z.boolean().default(false),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    badgeName: z.string().min(1),
    badgeImage: z.string().url().optional(),
});

export type StoreProjectInput = z.infer<typeof storeProjectSchema>;

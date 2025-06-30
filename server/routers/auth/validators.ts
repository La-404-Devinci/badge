import { z } from "zod";

export const listUsersSchema = z.object({
    page: z.number().default(1),
    limit: z.number().min(1).max(100).default(25),
    sortBy: z
        .enum(["user", "waitlistStatus", "role", "createdAt"])
        .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().nullable(),
    role: z.enum(["admin", "user", "all"]).optional(),
    waitlistStatus: z
        .enum(["approved", "pending", "rejected", "all"])
        .optional(),
});

export const banMultipleUsersSchema = z.object({
    userIds: z.array(z.string()).min(1),
});

export const updateMultipleUsersStatusSchema = z.object({
    emails: z.array(z.string()).min(1),
    status: z.enum(["approved", "pending", "rejected"]),
});

export const resendWhitelistInvitationSchema = z.object({
    email: z.string().email("Invalid email format"),
});

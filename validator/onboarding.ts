import { z } from "zod";

export const personalSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
});

export const roleSchema = z.object({
    role: z.string().min(3, "Role must be at least 3 characters long"),
});

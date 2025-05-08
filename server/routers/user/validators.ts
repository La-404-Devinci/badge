import { z } from "zod";

import { userPreferencesSchema } from "@/db/schema";

export const updateUserProfileSchema = z.object({
    fullName: z.string().min(2),
    image: z.string().url().optional(),
    position: z.string().optional(),
    biography: z.string().optional(),
    username: z.string().optional(),
});

export const exportUserDataSchema = z.object({
    includePreferences: z.boolean().default(true),
});

export const checkUsernameExistsSchema = z.object({
    username: z.string(),
});

export { userPreferencesSchema };

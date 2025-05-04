import { z } from "zod";

import { userPreferencesSchema } from "@/db/schema";

export const updateUserProfileSchema = z.object({
    fullName: z.string().min(2),
    image: z.string().url().optional(),
});

export const exportUserDataSchema = z.object({
    includePreferences: z.boolean().default(true),
});

export { userPreferencesSchema };

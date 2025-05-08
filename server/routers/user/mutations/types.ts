import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import {
    updateUserProfileSchema,
    userPreferencesSchema,
    checkUsernameExistsSchema,
} from "../validators";

export type SaveUserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type CheckUsernameExistsInput = z.infer<
    typeof checkUsernameExistsSchema
>;

export interface UserMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}

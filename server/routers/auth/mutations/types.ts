import { z } from "zod";

import { Database } from "@/db";

import {
    banMultipleUsersSchema,
    updateMultipleUsersStatusSchema,
    resendWhitelistInvitationSchema,
} from "../validators";

export type BanMultipleUsersInput = z.infer<typeof banMultipleUsersSchema>;
export type UpdateMultipleUsersStatusInput = z.infer<
    typeof updateMultipleUsersStatusSchema
>;
export type ResendWhitelistInvitationInput = z.infer<
    typeof resendWhitelistInvitationSchema
>;

export interface InputMutationContext<T> {
    input: T;
    db: Database;
}

export interface AuthMutationContext<T> {
    input: T;
}

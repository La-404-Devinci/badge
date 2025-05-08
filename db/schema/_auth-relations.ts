import { relations } from "drizzle-orm";

import { account, user } from "./auth-schema";

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
}));

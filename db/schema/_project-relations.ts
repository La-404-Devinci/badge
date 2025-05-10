import { relations } from "drizzle-orm";

import { user } from "./auth-schema";
import { project } from "./project";
import { projectContributor } from "./project";

export const projectContributorRelations = relations(
    projectContributor,
    ({ one }) => ({
        project: one(project, {
            fields: [projectContributor.projectId],
            references: [project.id],
        }),
        user: one(user, {
            fields: [projectContributor.userId],
            references: [user.id],
        }),
    })
);

export const projectRelations = relations(project, ({ many }) => ({
    projectContributors: many(projectContributor),
}));

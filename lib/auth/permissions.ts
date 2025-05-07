import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    member: ["view", "edit", "create"],
} as const;

const ac = createAccessControl(statement);

const baseUserPermissions = {
    user: ["list"] as ["list"],
    session: ["list"] as ["list"],
    member: ["view"] as ["view"],
} as const;

export const member = ac.newRole(baseUserPermissions);

export const admin = ac.newRole({
    ...adminAc.statements,
});

export const user = ac.newRole(baseUserPermissions);

export { ac };

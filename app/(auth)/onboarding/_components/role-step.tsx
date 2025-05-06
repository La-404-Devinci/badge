import { RiUserLine } from "@remixicon/react";

import HeaderStep from "./header-step";
import { RoleSelection } from "./role-selection";
export default function RoleStep() {
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title="Role"
                description="Role information"
                icon={<RiUserLine />}
            />
            <RoleSelection />
        </div>
    );
}

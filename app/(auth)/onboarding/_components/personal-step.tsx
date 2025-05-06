import { RiUserLine } from "@remixicon/react";

import HeaderStep from "./header-step";
import { PersonalForm } from "./personal-form";
export default function PersonalStep() {
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title="Personal"
                description="Personal information"
                icon={<RiUserLine />}
            />
            <PersonalForm />
        </div>
    );
}

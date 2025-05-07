import { RiBriefcaseLine } from "@remixicon/react";

import HeaderStep from "./header-step";
import { PositionForm } from "./position-form";
export default function PositionStep() {
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title="Position"
                description="Position information"
                icon={<RiBriefcaseLine />}
            />
            <PositionForm />
        </div>
    );
}

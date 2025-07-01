import * as Avatar from "@/components/ui/avatar";
import * as Badge from "@/components/ui/badge";
import * as Divider from "@/components/ui/divider";

import { ProjectContributor } from "../../_components/types";

function groupByRole(contributors: ProjectContributor[]) {
    const groups: Record<string, ProjectContributor[]> = {};
    for (const c of contributors) {
        const role = c.user.role ?? "Membre";
        if (!groups[role]) groups[role] = [];
        groups[role].push(c);
    }
    return groups;
}

function Contributor({ contributor }: { contributor: ProjectContributor }) {
    return (
        <div className="flex items-center gap-2 border border-neutral-100 w-full px-4 py-2 hover:bg-neutral-100 rounded-md transition-all duration-300">
            <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                    <Avatar.Root size="48" color="yellow">
                        <Avatar.Image
                            src={contributor.user.image ?? ""}
                            alt=""
                        />
                    </Avatar.Root>
                    <div className="text-sm text-gray-500">
                        {contributor.user.username}
                    </div>
                </div>
                <div>
                    <Badge.Root variant="filled" size="small">
                        {contributor.user.position}
                    </Badge.Root>
                </div>
            </div>
        </div>
    );
}

export default function Contributors({
    contributors,
}: {
    contributors: ProjectContributor[];
}) {
    const grouped = groupByRole(contributors);

    return (
        <div className="flex flex-col items-start gap-4">
            <h2 className="text-lg font-bold">Contributeurs</h2>
            {Object.entries(grouped).map(([role, group]) => (
                <div key={role} className="w-full gap-2 flex flex-col">
                    <Divider.Root variant="line-text">
                        <span className="text-sm text-gray-500">{role}</span>
                    </Divider.Root>
                    <div className="flex flex-col gap-1">
                        {group.map((contributor) => (
                            <Contributor
                                key={contributor.user.id}
                                contributor={contributor}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

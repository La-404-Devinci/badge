import * as Avatar from "@/components/ui/avatar";
import * as AvatarGroupCompact from "@/components/ui/avatar-group-compact";
import * as Tooltip from "@/components/ui/tooltip";

import { ProjectContributor } from "./types";

export function ContributorsCard({
    contributors,
}: {
    contributors: ProjectContributor[];
}) {
    return (
        <AvatarGroupCompact.Root size="24">
            <AvatarGroupCompact.Stack>
                {contributors.slice(0, 3).map((contributor) => (
                    <Tooltip.Root key={contributor.id}>
                        <Tooltip.Trigger asChild>
                            <Avatar.Root>
                                <Avatar.Image
                                    src={
                                        contributor.user.image ||
                                        `/placeholder.svg?height=32&width=32&text=${contributor.user.username}`
                                    }
                                />
                            </Avatar.Root>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <p>{contributor.user.username}</p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                ))}
            </AvatarGroupCompact.Stack>
            {contributors.length > 3 && (
                <AvatarGroupCompact.Overflow>
                    {contributors.length - 3}
                </AvatarGroupCompact.Overflow>
            )}
        </AvatarGroupCompact.Root>
    );
}

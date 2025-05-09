import * as Avatar from "@/components/ui/avatar";
import { PROJECT } from "@/constants/project";
import { getServerSession } from "@/lib/auth/utils";
import { prefetch, trpc, HydrateClient } from "@/trpc/server";

import { CreateProjectButton } from "./_components/create-project-button";
import Header from "../_components/header";
import { ScheduleButton } from "../_components/schedule-button";
import ActiveProjects from "./_components/active-projects";

export default async function ProjectsPage() {
    const session = await getServerSession();

    prefetch(trpc.project.getProjects.queryOptions());

    return (
        <>
            <Header
                icon={
                    <Avatar.Root size="48" color="yellow">
                        {session?.user?.image && (
                            <Avatar.Image src={session?.user?.image} alt="" />
                        )}
                    </Avatar.Root>
                }
                title={session?.user?.name}
                description={`Welcome back to ${PROJECT.NAME} 👋🏻`}
                contentClassName="hidden lg:flex"
            >
                <ScheduleButton className="hidden lg:flex" />
                <CreateProjectButton className="hidden lg:flex" />
            </Header>

            <HydrateClient>
                <ActiveProjects />
            </HydrateClient>
        </>
    );
}

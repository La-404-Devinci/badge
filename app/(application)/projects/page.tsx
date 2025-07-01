import * as Avatar from "@/components/ui/avatar";
import { PROJECT } from "@/constants/project";
import { getServerSession } from "@/lib/auth/utils";
import { prefetch, trpc, HydrateClient } from "@/trpc/server";

import { CreateProjectButton } from "./_components/create-project-button";
import Header from "../_components/header";
import ActiveProjects from "./_components/active-projects";
import YourProjects from "./_components/your-projects";
import { CreatePostButton } from "../_components/create-post-button";

export default async function ProjectsPage() {
    const session = await getServerSession();

    prefetch(trpc.project.getProjects.queryOptions());
    prefetch(trpc.project.getContributorProjects.queryOptions());
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
                <CreatePostButton className="hidden lg:flex" />
                <CreateProjectButton className="hidden lg:flex" />
            </Header>

            <HydrateClient>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8">
                        <ActiveProjects />
                    </div>

                    <div className="lg:col-span-4 lg:border-l border-neutral-200">
                        <YourProjects />
                    </div>
                </div>
            </HydrateClient>
        </>
    );
}

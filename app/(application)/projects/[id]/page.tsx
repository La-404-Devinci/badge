import { RiArticleLine } from "@remixicon/react";

import { prefetch } from "@/trpc/server";
import { trpc } from "@/trpc/server";

import ProjectContent from "./_components/project-content";
import Header from "../../_components/header";
import { CreateProjectButton } from "../_components/create-project-button";
interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;

    prefetch(trpc.project.getProject.queryOptions({ projectId: id }));

    return (
        <div className="flex flex-col gap-4">
            <Header
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiArticleLine className="size-6 text-text-sub-600" />
                    </div>
                }
                title="Project"
                description="Project description"
                contentClassName="hidden lg:flex"
            >
                <CreateProjectButton />
            </Header>
            <div className="flex flex-1 flex-col gap-4 lg:gap-8 lg:p-4">
                <ProjectContent id={id} />
            </div>
        </div>
    );
}

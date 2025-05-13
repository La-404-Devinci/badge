"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import Contributors from "./contributors";
import FileManagment from "./file-managment";
import LeaveProject from "./leave-project";
import { ProjectContributor } from "../../_components/types";
export default function ProjectContent({ id }: { id: string }) {
    const trpc = useTRPC();
    const { data, isLoading } = useQuery(
        trpc.project.getProject.queryOptions({ projectId: id })
    );

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
                <h1 className="text-2xl font-bold">{data?.data.title}</h1>
                <p className="text-sm text-gray-500">
                    {data?.data.description}
                </p>
                <FileManagment />
            </div>
            <div className="col-span-4">
                <div className="sticky top-0 flex flex-col gap-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                    <Contributors
                        contributors={
                            data?.data
                                .projectContributors as ProjectContributor[]
                        }
                    />
                    <LeaveProject id={id} />
                </div>
            </div>
        </div>
    );
}

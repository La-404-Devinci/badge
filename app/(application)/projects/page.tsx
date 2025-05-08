"use client";

import * as Avatar from "@/components/ui/avatar";
import { PROJECT } from "@/constants/project";
import { useUserData } from "@/hooks/use-user-data";

import { CreateProjectButton } from "./_components/create-project-button";
import Header from "../_components/header";
import { ScheduleButton } from "../_components/schedule-button";

export default function ProjectsPage() {
    const { user } = useUserData();

    return (
        <>
            <Header
                icon={
                    <Avatar.Root size="48" color="yellow">
                        {user?.image && (
                            <Avatar.Image src={user?.image} alt="" />
                        )}
                    </Avatar.Root>
                }
                title={user?.name}
                description={`Welcome back to ${PROJECT.NAME} 👋🏻`}
                contentClassName="hidden lg:flex"
            >
                <ScheduleButton className="hidden lg:flex" />
                <CreateProjectButton className="hidden lg:flex" />
            </Header>

            <div className="flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(344px,1fr))] items-start justify-center gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-label-lg font-medium">
                                Projects
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

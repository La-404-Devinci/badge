"use client";

import React, { useRef } from "react";

import {
    RiClockwise2Fill,
    RiGithubLine,
    RiMessage2Line,
    RiDiscordFill,
    RiFileTextLine,
    RiArrowUpFill,
    RiArrowDownFill,
} from "@remixicon/react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";

/* import * as     Avatar from "@/components/ui/avatar";*/
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as ProgressBar from "@/components/ui/progress-bar";
import * as Tooltip from "@/components/ui/tooltip";
import { USER_ROLES } from "@/constants/roles";
import { User } from "@/db/schema";
interface ProjectStatusCardProps {
    title: string;
    /*     contributors: Array<{ name: string; image?: string }> | null;
    skills: Array<{ title: string; completed: boolean }> | null; */
    id: string;
    description: string;
    badgeName: string;
    badgeImage: string;
    startDate: Date;
    endDate: Date;
    type: string;
    exclusive404: boolean;
    status: string;
    user: User;
}

export function ProjectCard({
    title,
    endDate,
    /*     contributors,
    skills, */
    description,
    badgeName,
    badgeImage,
    startDate,
    type,
    exclusive404,
    id,
    user,
}: ProjectStatusCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const toggleExpand = () => setIsExpanded((prev) => !prev);
    const contentRef = useRef<HTMLDivElement>(null);

    const now = new Date().getTime();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now - startDate.getTime();
    const progress = Math.max(
        0,
        Math.min(100, Math.round((elapsed / total) * 100))
    );

    return (
        <div>
            <div className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg rounded-lg border border-neutral-200 p-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-start w-full">
                        <div className="space-y-2">
                            <Badge.Root
                                variant="light"
                                className={
                                    progress === 100
                                        ? "bg-green-100 text-green-600"
                                        : "bg-blue-100 text-blue-600"
                                }
                            >
                                {progress === 100 ? "Completed" : "In Progress"}
                            </Badge.Root>
                            <h3 className="text-2xl font-semibold">{title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Image
                                        src={badgeImage}
                                        alt={badgeName}
                                        width={64}
                                        height={64}
                                        className="size-9 rounded-md"
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    {type === "uxui" ? (
                                        <p>UX/UI</p>
                                    ) : type === "dev" ? (
                                        <p>Dev</p>
                                    ) : type === "marketing" ? (
                                        <p>Marketing</p>
                                    ) : (
                                        <p>Other</p>
                                    )}
                                </Tooltip.Content>
                            </Tooltip.Root>
                            {exclusive404 && (
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <Button.Root
                                            variant="neutral"
                                            mode="lighter"
                                            size="small"
                                        >
                                            <RiDiscordFill className="size-4 " />
                                        </Button.Root>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <span>404</span>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            )}
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Button.Root
                                        variant="neutral"
                                        mode="lighter"
                                        size="small"
                                    >
                                        {type === "dev" ? (
                                            <RiGithubLine className="size-4" />
                                        ) : (
                                            <RiFileTextLine className="size-4" />
                                        )}
                                    </Button.Root>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    {type === "dev" ? (
                                        <p>View on GitHub</p>
                                    ) : (
                                        <p>View on Figma</p>
                                    )}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <ProgressBar.Root value={progress} className="h-2" />
                        <Button.Root
                            variant="neutral"
                            mode="stroke"
                            className="w-full"
                            onClick={toggleExpand}
                        >
                            {isExpanded ? (
                                <RiArrowUpFill className="size-4" />
                            ) : (
                                <RiArrowDownFill className="size-4" />
                            )}
                        </Button.Root>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            height: isExpanded ? "auto" : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="overflow-hidden"
                    >
                        <div ref={contentRef}>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4 pt-2"
                                    >
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <RiClockwise2Fill className="h-4 w-4 mr-2" />
                                                <span>
                                                    Due{" "}
                                                    {endDate.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <RiFileTextLine className="h-4 w-4 mr-2" />
                                                <span>{description}</span>
                                            </div>
                                        </div>
                                        {/*
                                        <div className="space-y-2">
                                           
                                            <h4 className="font-medium text-sm flex items-center">
                                                <RiUserLine className="h-4 w-4 mr-2" />
                                                Contributors
                                            </h4>
                                            <div className="flex -space-x-2">
                                                {contributors &&
                                                    contributors.map(
                                                        (
                                                            contributor,
                                                            index
                                                        ) => (
                                                            <Tooltip.Root
                                                                key={index}
                                                            >
                                                                <Tooltip.Trigger
                                                                    asChild
                                                                >
                                                                    <Avatar.Root className="border-2 border-white size-8">
                                                                        <Avatar.Image
                                                                            src={
                                                                                contributor.image ||
                                                                                `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                                                                            }
                                                                            alt={
                                                                                contributor.name
                                                                            }
                                                                            className="size-8"
                                                                        />
                                                                    </Avatar.Root>
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content>
                                                                    <p className="text-sm">
                                                                        {
                                                                            contributor.name
                                                                        }
                                                                    </p>
                                                                </Tooltip.Content>
                                                            </Tooltip.Root>
                                                        )
                                                    )}
                                            </div>
                                        </div>

                                         <div className="space-y-2">
                                            <h4 className="font-medium text-sm">
                                                Skills required
                                            </h4>
                                            {skills &&
                                                skills.map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-gray-600">
                                                            {skill.title}
                                                        </span>
                                                        {skill.completed && (
                                                            <RiCheckFill className="h-4 w-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                        </div> */}

                                        <div className="space-y-2 flex flex-col gap-2">
                                            <Button.Root
                                                className={`w-full`}
                                                variant="neutral"
                                                mode="stroke"
                                                disabled={
                                                    exclusive404
                                                        ? user.role !==
                                                          USER_ROLES.MEMBER
                                                        : false
                                                }
                                            >
                                                Want to participate?
                                            </Button.Root>
                                            <Button.Root
                                                className="w-full"
                                                asChild
                                            >
                                                <Link href={`/projects/${id}`}>
                                                    <RiMessage2Line className="h-4 w-4 mr-2" />
                                                    View Discussion
                                                </Link>
                                            </Button.Root>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

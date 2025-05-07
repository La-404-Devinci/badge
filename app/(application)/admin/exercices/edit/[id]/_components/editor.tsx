"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface ExerciceEditorProps {
    id: string;
}

export default function ExerciceEditor({ id }: ExerciceEditorProps) {
    const trpc = useTRPC();

    const { data: exercice } = useQuery(
        trpc.exercice.getAdminExercice.queryOptions({ id })
    );

    if (!exercice) return <div>Not found</div>;

    return <div>{JSON.stringify(exercice)}</div>;
}

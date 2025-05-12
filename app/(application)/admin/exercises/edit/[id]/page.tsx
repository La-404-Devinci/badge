import { notFound } from "next/navigation";

import { api } from "@/trpc/server";

import ExerciseEditor from "./_components/editor";

interface EditExercisePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExercisePage({
    params,
}: EditExercisePageProps) {
    const { id } = await params;

    const exercise = await api.exercise.getAdminExercise({ id });

    if (!exercise) {
        return notFound();
    }

    return <ExerciseEditor exercise={exercise} />;
}

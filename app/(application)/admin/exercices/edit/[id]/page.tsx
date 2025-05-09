import { notFound } from "next/navigation";

import { api } from "@/trpc/server";

import ExerciceEditor from "./_components/editor";

interface EditExercicePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExercicePage({
    params,
}: EditExercicePageProps) {
    const { id } = await params;

    const exercice = await api.exercice.getAdminExercice({ id });

    if (!exercice) {
        return notFound();
    }

    return <ExerciceEditor exercice={exercice} />;
}

import ExerciceEditor from "./_components/editor";

interface EditExercicePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExercicePage({
    params,
}: EditExercicePageProps) {
    const { id } = await params;

    return <ExerciceEditor id={id} />;
}

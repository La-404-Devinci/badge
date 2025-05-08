import Header from "./_components/header";

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full flex flex-col">
            <Header />
            {children}
        </div>
    );
}

export const ONBOARDING_STEPS = [
    { label: "Role", indicator: "1" },
    { label: "Personal", indicator: "2" },
    { label: "Position", indicator: "3" },
    { label: "Finish", indicator: "4" },
];

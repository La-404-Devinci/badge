import Header from "./_components/header";

export default function OnboardingLayout({
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
    { label: "Personal", indicator: "1" },
    { label: "Role", indicator: "2" },
    { label: "Position", indicator: "3" },
    { label: "Password", indicator: "4" },
];

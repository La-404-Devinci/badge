import { redirect, RedirectType } from "next/navigation";

import { SearchMenu } from "@/components/search";
import { PAGES } from "@/constants/pages";
import { getServerSession } from "@/lib/auth/utils";
import { cn } from "@/lib/utils";
import { UserIdentifier } from "@/providers/user-identifier";

import HeaderMobile from "./_components/header-mobile";
import { ImpersonationBanner } from "./_components/impersonation-banner";
import Sidebar from "./_components/sidebar";

export default async function ApplicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authResponse = await getServerSession();
    console.log(authResponse, "authResponse");
    if (!authResponse?.user) {
        redirect(PAGES.SIGN_IN, RedirectType.replace);
    }

    const isImpersonating = !!authResponse?.session?.impersonatedBy;

    return (
        <>
            <UserIdentifier user={authResponse.user} />
            {isImpersonating && (
                <ImpersonationBanner impersonatedUser={authResponse.user} />
            )}
            <div
                className={cn(
                    "grid grid-cols-1 content-start items-start lg:grid-cols-[auto,minmax(0,1fr)]",
                    {
                        "min-h-screen": !isImpersonating,
                        "min-h-[calc(100vh-44px)]": isImpersonating,
                    }
                )}
            >
                <Sidebar showBanner={isImpersonating} />
                <HeaderMobile />
                <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col">
                    {children}
                </div>
            </div>

            <SearchMenu />
        </>
    );
}

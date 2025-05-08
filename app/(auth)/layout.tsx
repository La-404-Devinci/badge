import CarouselWrapper from "./_components/carousel-wrapper";
import AuthFooter from "./_components/footer";
import AuthHeader from "./_components/header";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className="grid min-h-screen lg:grid-cols-[minmax(0,1fr),500px] xl:grid-cols-[minmax(0,1fr),596px] min-[1440px]:grid-cols-[minmax(0,844fr),minmax(0,596fr)]"
            style={{
                background:
                    "linear-gradient(180deg, #3D16CA 0%, #2918DC 25%, #3538E9 50%, #7E7EF1 75%, #C8CBF9 100%)",
            }}
        >
            <div className="flex h-full flex-col p-1.5 lg:p-2 lg:pr-0">
                <div className="flex flex-1 flex-col rounded-2xl bg-bg-white-0 px-3.5 lg:px-11 lg:py-6">
                    <AuthHeader />
                    <div className="flex flex-1 flex-col py-6 lg:py-12 [@media_(min-height:901px)]:justify-center ">
                        <div className="mx-auto flex w-full flex-col gap-6 md:translate-x-1.5 items-center">
                            {children}
                        </div>
                    </div>
                    <AuthFooter />
                </div>
            </div>

            <div className="hidden lg:block">
                <CarouselWrapper />
            </div>
        </div>
    );
}

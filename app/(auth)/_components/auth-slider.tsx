"use client";

import * as React from "react";

import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

import * as Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Slide = {
    avatar: {
        name: string;
        title: string;
        color?: React.ComponentPropsWithoutRef<typeof Avatar.Root>["color"];
        initials: string;
    };
    content: React.ReactNode;
};

const slides: Slide[] = [
    {
        avatar: {
            color: "yellow",
            name: "Sophia Williams",
            title: "CEO / Catalyst",
            initials: "SW",
        },
        content: (
            <>
                <span className="text-white">
                    The Marketing Management app has revolutionized our tasks.
                </span>{" "}
                It&apos;s efficient and user-friendly, streamlining planning to
                tracking.
            </>
        ),
    },
    {
        avatar: {
            color: "blue",
            name: "Alexandre Martin",
            title: "Marketing Director",
            initials: "AM",
        },
        content: (
            <>
                <span className="text-white">
                    This platform has transformed our marketing workflow.
                </span>{" "}
                The intuitive interface saves us hours of work and helps us stay
                organized.
            </>
        ),
    },
    {
        avatar: {
            color: "red",
            name: "Jasmine Chen",
            title: "Product Manager",
            initials: "JC",
        },
        content: (
            <>
                <span className="text-white">
                    As a product manager, I rely on this tool daily.
                </span>{" "}
                It has simplified our collaboration and improved our strategic
                planning process.
            </>
        ),
    },
];

type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

const useDotButton = (
    emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onDotButtonClick = React.useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    React.useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi
            .on("reInit", onInit)
            .on("reInit", onSelect)
            .on("select", onSelect);
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick,
    };
};

const DotButton = (props: React.ComponentPropsWithRef<"button">) => {
    const { className, ...rest } = props;

    return (
        <button
            type="button"
            className={cn(
                "size-1.5 shrink-0 rounded-full bg-orange-800/50 transition-all duration-200 ease-out",
                className
            )}
            {...rest}
        />
    );
};

export default function AuthSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        dragFree: false,
    });

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);

    React.useEffect(() => {
        // Auto-play functionality
        const autoplay = setInterval(() => {
            if (emblaApi) {
                emblaApi.scrollNext();
            }
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(autoplay);
    }, [emblaApi]);

    return (
        <div className="relative flex h-full flex-col items-center justify-center">
            <div className="absolute right-0 top-0 size-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-40" />

            <section className="embla relative w-full max-w-[452px] select-none pb-11">
                <div
                    className="embla__viewport overflow-hidden max-w-[452px]"
                    ref={emblaRef}
                >
                    <div className="embla__container flex">
                        {slides.map(({ avatar, content }, i) => (
                            <div
                                className="embla__slide min-w-full flex-shrink-0 flex-grow-0"
                                key={i}
                            >
                                <div className="flex w-full flex-col gap-10 px-6">
                                    <Avatar.Root size="48" color={avatar.color}>
                                        {avatar.initials}
                                    </Avatar.Root>

                                    <div className="flex w-full flex-col gap-7">
                                        <div className="max-w-[320px] font-inter-var text-title-h5 text-white/[.72]">
                                            {content}
                                        </div>

                                        <div>
                                            <div className="text-label-md text-white">
                                                {avatar.name}
                                            </div>
                                            <div className="mt-1 text-label-sm text-white/[.72]">
                                                {avatar.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-6 flex gap-2">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={cn(
                                index === selectedIndex
                                    ? "w-5 bg-static-white opacity-100"
                                    : "opacity-70 hover:opacity-100"
                            )}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

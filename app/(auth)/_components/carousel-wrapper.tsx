"use client";

import dynamic from "next/dynamic";

const DynamicAuthCarousel = dynamic(() => import("./auth-slider"), {
    ssr: false,
});

export default function CarouselWrapper() {
    return (
        <div className="relative size-full">
            <DynamicAuthCarousel />
        </div>
    );
}

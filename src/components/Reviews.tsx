"use client";
import React, { HTMLAttributes, useRef } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

const PHONES = [
    "/testimonials/1.jpg",
    "/testimonials/2.jpg",
    "/testimonials/3.jpg",
    "/testimonials/4.jpg",
    "/testimonials/5.jpg",
    "/testimonials/6.jpg",
];

function splitArray<T>(array: Array<T>, numParts: number) {
    const result: Array<Array<T>> = [];

    for (let i = 0; i < array.length; i++) {
        const index = i % numParts;
        if (!result[index]) {
            result[index] = [];
        }
        result[index].push(array[i]);
    }

    return result;
}

function ReviewColumn({
    reviews,
    className,
    reviewClassName,
    msPerPixel = 0,
}: {
    reviews: string[];
    className?: string;
    reviewClassName?: (reviewIndex: number) => string;
    msPerPixel?: number;
}) {
    const columnRef = useRef<HTMLDivElement | null>(null);
    const [columnHeight, setCoumnHeight] = React.useState(0);
    const duration = `${columnHeight * msPerPixel}ms`;

    React.useEffect(() => {
        if (!columnRef.current) return;
        const resizeObserver = new window.ResizeObserver(() => {
            setCoumnHeight(columnRef.current?.offsetHeight ?? 0);
        });
        resizeObserver.observe(columnRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div
            ref={columnRef}
            className={cn("animate-marquee space-y-8 py-4", className)}
            style={{ "--marquee-duration": duration } as React.CSSProperties}>
            {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
                <Review
                    key={reviewIndex}
                    className={reviewClassName?.(reviewIndex % reviews.length)}
                    imgSrc={imgSrc}
                />
            ))}
        </div>
    );
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
    imgSrc: string;
}

function Review({ imgSrc, className, ...props }: ReviewProps) {
    const POSSIBLE_ANIMATION_DELAYS = [
        "0s",
        "0.1s",
        "0.2s",
        "0.3s",
        "0.4s",
        "0.5s",
    ];

    const animationDelay =
        POSSIBLE_ANIMATION_DELAYS[
            Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
        ];

    return (
        <div
            {...props}
            className={cn(
                "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
                className
            )}
            style={{ animationDelay }}>
            <Phone imgSrc={imgSrc} />
        </div>
    );
}

function ReviewGrid() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.4 });
    const columns = splitArray(PHONES, 3);
    const col1 = columns[0];
    const col2 = columns[1];
    const col3 = splitArray(columns[2], 2);

    return (
        <div
            ref={containerRef}
            className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {isInView ? (
                <>
                    <ReviewColumn
                        reviews={[...col1, ...col3.flat(), ...col2]}
                        reviewClassName={(reviewIndex) =>
                            cn({
                                "md:hidden":
                                    reviewIndex >= col1.length + col3[0].length,
                                "lg:hidden": reviewIndex >= col1.length,
                            })
                        }
                        msPerPixel={10}
                    />
                    <ReviewColumn
                        className="hidden md:block"
                        reviews={[...col2, ...col3[1]]}
                        reviewClassName={(reviewIndex) =>
                            reviewIndex >= col2.length ? "lg:hidden" : ""
                        }
                        msPerPixel={15}
                    />
                    <ReviewColumn
                        className="hidden md:block"
                        reviews={col3.flat()}
                        msPerPixel={10}
                    />
                </>
            ) : null}
            <div className="pointer-event-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"></div>
            <div className="pointer-event-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"></div>
        </div>
    );
}

const Reviews = () => {
    return (
        <MaxWidthWrapper className="relative max-w-5xl">
            <img
                aria-hidden="true"
                src="/what-people-are-buying.png"
                className="absolute select-none hidden xl:block -left-32 top-1/3"
            />
            <ReviewGrid />
        </MaxWidthWrapper>
    );
};

export default Reviews;

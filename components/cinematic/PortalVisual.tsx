"use client";
import Butterfly from "./Butterfly";

import type { PointerEvent } from "react";

const stars = [
    { top: "10%", left: "15%", size: 2, delay: 0, depth: "far" },
    { top: "20%", left: "35%", size: 3, delay: 1, depth: "near" },
    { top: "12%", left: "65%", size: 2, delay: 2, depth: "far" },
    { top: "28%", left: "85%", size: 3, delay: 0.5, depth: "near" },
    { top: "42%", left: "10%", size: 2, delay: 1.5, depth: "far" },
    { top: "55%", left: "28%", size: 3, delay: 2.5, depth: "near" },
    { top: "68%", left: "90%", size: 2, delay: 0.8, depth: "far" },
    { top: "75%", left: "18%", size: 3, delay: 1.8, depth: "near" },
    { top: "35%", left: "55%", size: 2, delay: 2.2, depth: "far" },
    { top: "18%", left: "92%", size: 2, delay: 0.3, depth: "near" },
    { top: "82%", left: "72%", size: 3, delay: 1.3, depth: "far" },
    { top: "48%", left: "75%", size: 2, delay: 2.7, depth: "near" },
    { top: "8%", left: "48%", size: 2, delay: 0.7, depth: "far" },
    { top: "62%", left: "48%", size: 2, delay: 1.9, depth: "near" },
    { top: "88%", left: "42%", size: 2, delay: 2.4, depth: "far" },
];

export default function PortalVisual({ showButterfly = true }: { showButterfly?: boolean }) {

    // Move stars according to mouse position
    const handleMouseMove = (e: PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        const element = e.currentTarget;

        // Nearby stars move more
        element.style.setProperty("--near-x", `${x * 18}px`);
        element.style.setProperty("--near-y", `${y * 14}px`);

        element.style.setProperty("--butterfly-x", `${x * 10}px`);
        element.style.setProperty("--butterfly-y", `${y * 8}px`);

        // Distant stars move less
        element.style.setProperty("--far-x", `${-x * 6}px`);
        element.style.setProperty("--far-y", `${-y * 5}px`);
    };

    // Return stars to their original position
    const handleMouseLeave = (e: PointerEvent<HTMLDivElement>) => {
        const element = e.currentTarget;

        element.style.setProperty("--near-x", "0px");
        element.style.setProperty("--near-y", "0px");
        element.style.setProperty("--far-x", "0px");
        element.style.setProperty("--far-y", "0px");

        element.style.setProperty("--butterfly-x", "0px");
        element.style.setProperty("--butterfly-y", "0px");
    };

    return (
        <div
            className="portal-scene"
            role="img"
            aria-label="A glowing lavender portal surrounded by stars"
            onPointerMove={handleMouseMove}
            onPointerLeave={handleMouseLeave}
        >
            <div className="portal-halo" />
            <div className="portal-floor-light" />

            {/* Distant Stars */}
            <div className="portal-stars portal-stars--far">
                {stars
                    .filter(star => star.depth === "far")
                    .map((star, index) => (
                        <span
                            key={index}
                            className="portal-star"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                animationDelay: `${star.delay}s`,
                            }}
                        />
                    ))}
            </div>

            {showButterfly && <Butterfly />}

            {/* Portal */}
            <div className="portal-door">
                <div className="portal-interior" />

                <div className="portal-arch arch-1" />
                <div className="portal-arch arch-2" />
                <div className="portal-arch arch-3" />
                <div className="portal-arch arch-4" />
            </div>

            {/* Nearby Stars */}
            <div className="portal-stars portal-stars--near">
                {stars
                    .filter(star => star.depth === "near")
                    .map((star, index) => (
                        <span
                            key={index}
                            className="portal-star"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                animationDelay: `${star.delay}s`,
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}


"use client";

import { useTransform, motion, MotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import SignupModal from "./SignupModal";

interface TextOverlayProps {
    scrollYProgress: MotionValue<number>;
}

interface TextBlock {
    text: string;
    inStart: number;
    inEnd: number;
    outStart: number;
    outEnd: number;
    yFrom: number;
    yTo: number;
    size: "normal" | "large";
    weight: "light" | "bold";
    tracking: "wide" | "widest" | "ultra";
    isCTA?: boolean;
    yOffset?: string;
}

const TEXT_BLOCKS: TextBlock[] = [
    {
        text: "Something is inside.",
        inStart: 0.0,
        inEnd: 0.08,
        outStart: 0.17,
        outEnd: 0.22,
        yFrom: 12,
        yTo: 0,
        size: "normal",
        weight: "light",
        tracking: "widest",
    },
    {
        text: "Let it out.",
        inStart: 0.35,
        inEnd: 0.42,
        outStart: 0.50,
        outEnd: 0.55,
        yFrom: 40,
        yTo: 0,
        size: "large",
        weight: "bold",
        tracking: "wide",
    },
    {
        text: "Chaos has a shape.",
        inStart: 0.63,
        inEnd: 0.70,
        outStart: 0.77,
        outEnd: 0.82,
        yFrom: 8,
        yTo: 0,
        size: "normal",
        weight: "light",
        tracking: "widest",
    },
    {
        text: "CANDY DROP. 2025.",
        inStart: 0.88,
        inEnd: 0.94,
        outStart: 1.1,
        outEnd: 1.1,
        yFrom: 16,
        yTo: 0,
        size: "large",
        weight: "bold",
        tracking: "ultra",
        yOffset: "-5vh",
    },
    {
        text: "JOIN THE DROP",
        inStart: 0.94,
        inEnd: 0.98,
        outStart: 2,
        outEnd: 2,
        yFrom: 0,
        yTo: 0,
        size: "normal",
        weight: "bold",
        tracking: "widest",
        isCTA: true,
    },
];

function TextLine({
    block,
    scrollYProgress,
}: {
    block: TextBlock;
    scrollYProgress: MotionValue<number>;
}) {
    const opacity = useTransform(
        scrollYProgress,
        [block.inStart, block.inEnd, block.outStart, block.outEnd],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [block.inStart, block.inEnd],
        [block.yFrom, block.yTo]
    );

    const fontSize =
        block.size === "large"
            ? "clamp(2.5rem, 6vw, 6rem)"
            : "clamp(0.9rem, 2vw, 1.4rem)";

    const fontWeight = block.weight === "bold" ? 900 : 300;

    const letterSpacing =
        block.tracking === "ultra"
            ? "0.25em"
            : block.tracking === "widest"
                ? "0.15em"
                : "0.08em";

    return (
        <motion.div
            style={{
                opacity,
                y,
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                marginTop: block.yOffset,
            }}
        >
            <span
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize,
                    fontWeight,
                    letterSpacing,
                    color: "#ffffff",
                    textAlign: "center",
                    textTransform: block.weight === "bold" ? "uppercase" : "none",
                    lineHeight: 1.1,
                    padding: "0 2rem",
                    // Subtle text shadow for depth
                    textShadow:
                        block.weight === "bold"
                            ? "0 0 60px rgba(255,255,255,0.15), 0 2px 30px rgba(0,0,0,0.8)"
                            : "0 2px 20px rgba(0,0,0,0.9)",
                    mixBlendMode: "normal",
                }}
            >
                {block.text}
            </span>
        </motion.div>
    );
}

export default function TextOverlay({ scrollYProgress }: TextOverlayProps) {
    const [showCTA, setShowCTA] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (latest >= 0.94) {
                setShowCTA(true);
            } else {
                setShowCTA(false);
            }
        });
        return unsubscribe;
    }, [scrollYProgress]);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 10,
                }}
            >
                {TEXT_BLOCKS.filter(b => !b.isCTA).map((block, i) => (
                    <TextLine key={i} block={block} scrollYProgress={scrollYProgress} />
                ))}
                <motion.div
                    initial={{ opacity: 0, pointerEvents: "none" }}
                    animate={{
                        opacity: showCTA ? 1 : 0,
                        pointerEvents: showCTA ? "auto" : "none",
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: showCTA ? 2.5 : 0 },
                        pointerEvents: { delay: showCTA ? 2.5 : 0 },
                    }}
                    style={{
                        position: "absolute",
                        bottom: "34%",
                        left: "50%",
                        x: "-50%",
                    }}
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: "rgba(0, 0, 0, 0.45)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.85)",
                            color: "white",
                            padding: "1rem 2.5rem",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "background 300ms ease, color 300ms ease, border-color 300ms ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
                            e.currentTarget.style.color = "#050505";
                            e.currentTarget.style.borderColor = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0, 0, 0, 0.45)";
                            e.currentTarget.style.color = "white";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.85)";
                        }}
                    >
                        JOIN THE DROP
                    </button>
                </motion.div>
            </div>
            <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

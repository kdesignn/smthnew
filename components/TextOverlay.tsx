"use client";

import { useTransform, motion, MotionValue } from "framer-motion";

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
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 10,
            }}
        >
            {TEXT_BLOCKS.map((block, i) => (
                <TextLine key={i} block={block} scrollYProgress={scrollYProgress} />
            ))}
        </div>
    );
}

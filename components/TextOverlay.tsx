"use client";

import { useTransform, motion, MotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import SignupModal from "./SignupModal";
import ScrollArrow from "./ScrollArrow";

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
            ? "clamp(1.8rem, 8vw, 6rem)"
            : "clamp(0.85rem, 4vw, 1.4rem)";

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
                    padding: "0 clamp(1rem, 5vw, 2rem)",
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

    // About Panel State
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [bottomControlBlend, setBottomControlBlend] = useState(0);
    const [showEyebrow, setShowEyebrow] = useState(false);
    const [showLine1, setShowLine1] = useState(false);
    const [showLine2, setShowLine2] = useState(false);
    const [showLine3, setShowLine3] = useState(false);
    const [showFinal, setShowFinal] = useState(false);

    // Scroll listener for cross icon visibility
    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
            setIsAtBottom(bottom);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Staggered reveal logic for About Panel
    useEffect(() => {
        if (isAboutOpen) {
            const t0 = setTimeout(() => setShowEyebrow(true), 0);
            const t1 = setTimeout(() => setShowLine1(true), 300);
            const t2 = setTimeout(() => setShowLine2(true), 600);
            const t3 = setTimeout(() => setShowLine3(true), 1000);
            const t4 = setTimeout(() => setShowFinal(true), 1700);
            return () => {
                clearTimeout(t0);
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
            };
        } else {
            const t0 = setTimeout(() => {
                setShowEyebrow(false);
                setShowLine1(false);
                setShowLine2(false);
                setShowLine3(false);
                setShowFinal(false);
            }, 0);
            return () => clearTimeout(t0);
        }
    }, [isAboutOpen]);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (latest >= 0.94) {
                setShowCTA(true);
            } else {
                setShowCTA(false);
            }

            const start = 0.93;
            const end = 0.99;
            const blend = Math.min(Math.max((latest - start) / (end - start), 0), 1);
            setBottomControlBlend(isAtBottom ? 1 : blend);
        });
        return unsubscribe;
    }, [isAtBottom, scrollYProgress]);

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
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
                            padding: "clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 6vw, 2.5rem)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "clamp(0.7rem, 2.5vw, 0.9rem)",
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

            {/* About Panel (Layer 40) */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "#121212",
                    zIndex: 40,
                    transform: isAboutOpen ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "8rem", // Clear the icon
                }}
            >
                <div
                    style={{
                        opacity: showEyebrow ? 1 : 0,
                        transition: "opacity 0.5s ease",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "clamp(0.55rem, 2vw, 0.62rem)",
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.2)",
                        textTransform: "uppercase",
                        marginTop: "3vh",
                        marginBottom: "4rem",
                    }}
                >
                    Candy Drop — Berlin
                </div>

                <div
                    style={{
                        opacity: showLine1 ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: "clamp(2.2rem, 10vw, 5.5rem)",
                        color: "white",
                        lineHeight: 1.1,
                    }}
                >
                    No names.
                </div>

                <div
                    style={{
                        opacity: showLine2 ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: "clamp(2.2rem, 10vw, 5.5rem)",
                        color: "white",
                        lineHeight: 1.1,
                    }}
                >
                    No address.
                </div>

                <div
                    style={{
                        opacity: showLine3 ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: "clamp(2.2rem, 10vw, 5.5rem)",
                        color: "white",
                        lineHeight: 1.1,
                    }}
                >
                    No warning.
                </div>

                <div
                    style={{
                        opacity: showFinal ? 1 : 0,
                        transition: "opacity 0.8s ease",
                        marginTop: "4rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2rem",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontStyle: "italic",
                            fontSize: "clamp(2.2rem, 10vw, 5.5rem)",
                            color: "rgba(255,255,255,0.35)",
                            lineHeight: 1.1,
                        }}
                    >
                        Just the drop.
                    </div>

                    <div
                        style={{
                            width: "1px",
                            height: "3.5rem",
                            backgroundColor: "rgba(255,255,255,0.08)",
                        }}
                    />

                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "clamp(0.65rem, 3vw, 0.75rem)",
                            fontWeight: 300,
                            letterSpacing: "0.14em",
                            lineHeight: 2.2,
                            color: "rgba(255,255,255,0.25)",
                            textTransform: "uppercase",
                            textAlign: "center",
                        }}
                    >
                        We are a collective of one.<br />
                        We come to you.<br />
                        You will not find us.
                    </div>
                </div>
            </div>

            <ScrollArrow
                blend={bottomControlBlend}
                isAboutOpen={isAboutOpen}
                isInteractive={isAtBottom || bottomControlBlend > 0.85 || isAboutOpen}
                onToggleAbout={() => setIsAboutOpen((value) => !value)}
            />
        </>
    );
}

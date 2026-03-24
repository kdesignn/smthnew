"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useMotionValue, useTransform, motion } from "framer-motion";
import TextOverlay from "./TextOverlay";
import ScrollArrow from "./ScrollArrow";

const FRAME_COUNT = 128;
// Use NODE_ENV to reliably determine if we are in the GitHub Pages production build
const BASE_PATH = process.env.NODE_ENV === "production" ? "/smthnew/sequence-1" : "/sequence-1";
// Total scrollable height = 500vh, so scrollTrackHeight needs to exceed viewport
// We set the container to 500vh and measure actual scrollable distance
const SCROLL_MULTIPLIER = 5; // 500vh

export default function ExplosionScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef<number>(0);
    const rafRef = useRef<number>(0);

    const [loadProgress, setLoadProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Raw motion value [0, 1] driven by native window scroll
    const scrollProgress = useMotionValue(0);

    // Draw a frame to the canvas (cover-fit)
    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const imgs = imagesRef.current;
        if (!imgs[index]) return;
        const img = imgs[index];
        if (!img.complete || img.naturalWidth === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width: cw, height: ch } = canvas;
        const { naturalWidth: iw, naturalHeight: ih } = img;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Preload all frames eagerly
    useEffect(() => {
        let loaded = 0;
        const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `${BASE_PATH}/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`;
            imgs[i] = img;

            const onDone = () => {
                loaded++;
                setLoadProgress(loaded / FRAME_COUNT);
                if (loaded === FRAME_COUNT) {
                    imagesRef.current = imgs;
                    setIsReady(true);
                }
            };
            img.onload = onDone;
            img.onerror = onDone;
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Resize canvas to fill viewport exactly
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (isReady) drawFrame(currentFrameRef.current);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [isReady, drawFrame]);

    // Native window scroll → progress [0,1]
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const maxScroll = el.scrollHeight - el.clientHeight;
            if (maxScroll <= 0) return;
            const progress = Math.min(window.scrollY / maxScroll, 1);
            scrollProgress.set(progress);

            if (!isReady) return;

            // Map directly to frame here in the listener (no motion value subscription lag)
            const targetFrame = Math.min(
                Math.floor(progress * (FRAME_COUNT - 1)),
                FRAME_COUNT - 1
            );

            if (targetFrame === currentFrameRef.current) return;
            currentFrameRef.current = targetFrame;

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isReady, drawFrame, scrollProgress]);

    // Draw first frame once loaded
    useEffect(() => {
        if (isReady) {
            currentFrameRef.current = 0;
            drawFrame(0);
        }
    }, [isReady, drawFrame]);

    const [isFinalFrame, setIsFinalFrame] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollProgress.on("change", (latest) => {
            if (latest >= 0.982) {
                setIsFinalFrame(true);
            } else {
                setIsFinalFrame(false);
            }
        });
        return unsubscribe;
    }, [scrollProgress]);

    return (
        <>
            {/* 
        * Sticky canvas panel — fixed in view, always full viewport.
        * position:fixed means it never scrolls away regardless of parent overflow.
      */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "#050505",
                    zIndex: 0,
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                    }}
                />

                {/* Final background fade */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isFinalFrame ? 1 : 0 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#121212",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                {/* Loading overlay */}
                {!isReady && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#050505",
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                width: "10rem",
                                height: "1px",
                                backgroundColor: "rgba(255,255,255,0.08)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    inset: "0 auto 0 0",
                                    width: `${loadProgress * 100}%`,
                                    backgroundColor: "#fff",
                                    transition: "width 80ms linear",
                                }}
                            />
                        </div>
                        <p
                            style={{
                                marginTop: "1.25rem",
                                color: "rgba(255,255,255,0.2)",
                                fontSize: "0.65rem",
                                letterSpacing: "0.35em",
                                textTransform: "uppercase",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            {Math.round(loadProgress * 100)}%
                        </p>
                    </div>
                )}

                {/* Text overlay */}
                {isReady && <TextOverlay scrollYProgress={scrollProgress} />}

                {/* Scroll Indicator */}
                {isReady && <ScrollArrow isHidden={isFinalFrame} />}
            </div>

            {/*
        * Scroll track — invisible spacer that gives the page its 500vh height.
        * The fixed canvas above renders against this scrollable space.
      */}
            <div style={{ height: `${SCROLL_MULTIPLIER * 100}vh`, width: "100%" }} />
        </>
    );
}

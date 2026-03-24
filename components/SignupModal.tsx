"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsError(false);

        if (!validateEmail(email)) {
            setIsError(true);
            // Reset error after animation completes (approx 500ms)
            setTimeout(() => setIsError(false), 500);
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.85)",
                    zIndex: 100,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "auto",
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: isError ? [0, -10, 10, -10, 10, 0] : 0
                    }}
                    transition={{
                        x: { duration: 0.4, ease: "easeInOut" },
                        default: { duration: 0.3 }
                    }}
                    style={{
                        backgroundColor: "#0e0e0e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "clamp(2rem, 8vw, 3.5rem) clamp(1.5rem, 6vw, 2.5rem)",
                        maxWidth: "420px",
                        width: "92%",
                        position: "relative",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "1.5rem",
                            right: "1.5rem",
                            color: "rgba(255,255,255,0.3)",
                            border: "none",
                            background: "transparent",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            transition: "color 300ms ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >
                        ✕
                    </button>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit}>
                            <h2
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.2rem, 5vw, 2rem)",
                                    letterSpacing: "0.1em",
                                    color: "white",
                                    margin: 0,
                                    textTransform: "uppercase",
                                }}
                            >
                                YOU'RE EARLY.
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 300,
                                    fontSize: "clamp(0.75rem, 3vw, 0.85rem)",
                                    letterSpacing: "0.1em",
                                    color: "rgba(255,255,255,0.4)",
                                    marginTop: "0.5rem",
                                    marginBottom: "2.5rem",
                                }}
                            >
                                Drop your email. Be first.
                            </p>

                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: `1px solid ${isError ? "#ff4444" : "rgba(255,255,255,0.2)"}`,
                                    color: "white",
                                    fontSize: "1rem",
                                    padding: "0.75rem 0",
                                    outline: "none",
                                    fontFamily: "Inter, sans-serif",
                                    transition: "border-color 300ms ease",
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: "100%",
                                    marginTop: "2.5rem",
                                    background: "rgba(0,0,0,0.45)",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.85)",
                                    color: "white",
                                    padding: "clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 6vw, 2.5rem)",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)",
                                    letterSpacing: "0.25em",
                                    textTransform: "uppercase",
                                    cursor: isSubmitting ? "wait" : "pointer",
                                    transition: "background 300ms ease, color 300ms ease, border-color 300ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = "white";
                                        e.currentTarget.style.color = "#050505";
                                        e.currentTarget.style.borderColor = "white";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = "rgba(0,0,0,0.45)";
                                        e.currentTarget.style.color = "white";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)";
                                    }
                                }}
                            >
                                {isSubmitting ? "SENDING..." : "NOTIFY ME"}
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: "center", padding: "1rem 0" }}>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                style={{
                                    fontSize: "3rem",
                                    color: "white",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                ✓
                            </motion.div>
                            <h2
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.2rem, 5vw, 2rem)",
                                    letterSpacing: "0.1em",
                                    color: "white",
                                    margin: 0,
                                    textTransform: "uppercase",
                                }}
                            >
                                YOU'RE ON THE LIST.
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 300,
                                    fontSize: "clamp(0.75rem, 3vw, 0.85rem)",
                                    letterSpacing: "0.1em",
                                    color: "rgba(255,255,255,0.4)",
                                    marginTop: "0.5rem",
                                }}
                            >
                                We'll find you when it drops.
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

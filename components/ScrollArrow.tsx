import { motion } from "framer-motion";

interface BottomControlProps {
    blend: number;
    isAboutOpen: boolean;
    isInteractive: boolean;
    onToggleAbout: () => void;
}

export default function ScrollArrow({
    blend,
    isAboutOpen,
    isInteractive,
    onToggleAbout,
}: BottomControlProps) {
    const arrowOpacity = Math.max(0, 1 - blend);
    const menuOpacity = Math.max(0, blend);

    return (
        <div
            style={{
                position: "fixed",
                bottom: "2.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                width: "clamp(72px, 16vw, 96px)",
                height: "clamp(72px, 16vw, 96px)",
            }}
        >
            <motion.div
                initial={{ opacity: 1 }}
                animate={{
                    opacity: arrowOpacity,
                    y: blend * 10,
                    scale: 1 - blend * 0.08,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                }}
            >
                <motion.p
                    style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.8rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    Scroll
                </motion.p>
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </motion.svg>
            </motion.div>

            <motion.button
                type="button"
                aria-label={isAboutOpen ? "Close about panel" : "Open about panel"}
                aria-expanded={isAboutOpen}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                    opacity: menuOpacity,
                    scale: 0.85 + blend * 0.15,
                    y: (1 - blend) * 8,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={onToggleAbout}
                disabled={!isInteractive}
                style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width: "clamp(40px, 10vw, 48px)",
                    height: "clamp(40px, 10vw, 48px)",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isInteractive ? "pointer" : "default",
                    pointerEvents: isInteractive ? "auto" : "none",
                    padding: 0,
                }}
            >
                <span
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "clamp(1.2rem, 4vw, 1.4rem)",
                        fontWeight: 200,
                        color: isAboutOpen ? "rgba(255,255,255,0.6)" : "white",
                        transform: isAboutOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition:
                            "transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), color 0.5s ease",
                        lineHeight: 0,
                        marginTop: "-2px",
                    }}
                >
                    +
                </span>
            </motion.button>
        </div>
    );
}

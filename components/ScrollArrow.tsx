import { motion } from "framer-motion";

export default function ScrollArrow({ isHidden }: { isHidden: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isHidden ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
                position: "absolute",
                bottom: "2.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
    );
}

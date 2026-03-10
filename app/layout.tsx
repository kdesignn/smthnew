import type { Metadata } from "next";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "CANDY DROP. 2025.",
    description: "A cinematic scroll-driven experience. Something is inside.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                style={{
                    backgroundColor: "#050505",
                    margin: 0,
                    padding: 0,
                }}
            >
                <LenisProvider>{children}</LenisProvider>
            </body>
        </html>
    );
}

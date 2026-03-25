"use client";

import { useRef } from "react";

interface PreloadedImages {
    images: HTMLImageElement[];
    progress: number;
    isReady: boolean;
}

export function useImagePreloader(
    frameCount: number,
    basePath: string
): PreloadedImages {
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const progressRef = useRef<number>(0);
    const isReadyRef = useRef<boolean>(false);
    const hasStartedRef = useRef<boolean>(false);

    if (!hasStartedRef.current) {
        hasStartedRef.current = true;

        let loaded = 0;
        const imgs: HTMLImageElement[] = [];

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const index = String(i).padStart(3, "0");
            img.src = `${basePath}/ezgif-frame-${index}.png`;
            img.onload = () => {
                loaded++;
                progressRef.current = loaded / frameCount;
                if (loaded === frameCount) {
                    isReadyRef.current = true;
                }
            };
            img.onerror = () => {
                loaded++;
                progressRef.current = loaded / frameCount;
                if (loaded === frameCount) {
                    isReadyRef.current = true;
                }
            };
            imgs.push(img);
        }

        imagesRef.current = imgs;
    }

    return {
        images: imagesRef.current,
        progress: progressRef.current,
        isReady: isReadyRef.current,
    };
}

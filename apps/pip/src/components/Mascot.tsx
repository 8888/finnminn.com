import { useEffect, useState } from 'react';
import { Button, Terminal, Typography } from "@finnminn/ui";

const CONFIG = {
    FRAMES_DIR: '/mascot/frames/',
    FRAME_FILES: ['neutral.txt', 'up.txt', 'down.txt'],
    // 0: Neutral, 1: Up, 2: Down
    FLAP_SEQUENCE: [1, 0, 2, 0],
    INTERVAL_MS: 100,
    DELAY_MIN: 1000,
    DELAY_MAX: 5000,
    CYCLES_MIN: 1,
    CYCLES_MAX: 3
};

export function Mascot() {
    const [frames, setFrames] = useState<string[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    useEffect(() => {
        // Load frames
        const loadFrames = async () => {
            try {
                const promises = CONFIG.FRAME_FILES.map(async file => {
                    const res = await fetch(`${CONFIG.FRAMES_DIR}${file}`);
                    return await res.text();
                });
                const loadedFrames = await Promise.all(promises);
                setFrames(loadedFrames);
            } catch (error) {
                console.error("Failed to load mascot frames", error);
            }
        };
        loadFrames();
    }, []);

    useEffect(() => {
        if (frames.length === 0) return;

        let isMounted = true;

        const runAnimation = async () => {
            while (isMounted) {
                // 1. Wait
                const delay = Math.floor(Math.random() * (CONFIG.DELAY_MAX - CONFIG.DELAY_MIN + 1)) + CONFIG.DELAY_MIN;
                await new Promise(r => setTimeout(r, delay));
                if (!isMounted) break;

                // 2. Determine cycles
                const cycles = Math.floor(Math.random() * (CONFIG.CYCLES_MAX - CONFIG.CYCLES_MIN + 1)) + CONFIG.CYCLES_MIN;

                // 3. Flap
                for (let i = 0; i < cycles; i++) {
                    for (const frameIdx of CONFIG.FLAP_SEQUENCE) {
                        setCurrentFrameIndex(frameIdx);
                        await new Promise(r => setTimeout(r, CONFIG.INTERVAL_MS));
                        if (!isMounted) break;
                    }
                    if (!isMounted) break;
                }
                setCurrentFrameIndex(0);
            }
        };

        runAnimation();

        return () => {
            isMounted = false;
        };
    }, [frames]);

    if (frames.length === 0) return null;

    return (
        <Typography.Body
            variant="pip"
            size="xs"
            glow={true}
            className="animate-spectral text-center leading-none whitespace-pre overflow-hidden mb-0"
        >
            {frames[currentFrameIndex]}
        </Typography.Body>
    );
}

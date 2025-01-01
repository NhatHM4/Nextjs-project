import { useEffect, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
};

// WaveSurfer hook
const useWavesurfer = (containerRef: React.RefObject<HTMLDivElement>
    , options: Omit<WaveSurferOptions, 'container'>) => {
    const [wavesurfer, setWavesurfer] = useState<any>(null)

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}


export { useHasMounted, useWavesurfer };
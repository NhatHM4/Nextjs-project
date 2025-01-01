
'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js'


// WaveSurfer hook
const useWavesurfer = (containerRef: any, options: any) => {
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

const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        }
    }, [fileName])
    // const options = {
    //     waveColor: 'rgb(200, 0, 200)',
    //     progressColor: 'rgb(100, 0, 100)',
    //     url: `/api?audio=${fileName}`,
    // }
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);



    // useEffect(() => {

    //     const wavesurfer = WaveSurfer.create({
    //         container: ref.current as HTMLElement,
    //         waveColor: 'rgb(146, 142, 146)',
    //         progressColor: 'rgb(100, 0, 100)',
    //         url: `/api?audio=${audio}`,
    //     });
    // }, []);

    return (
        <div ref={containerRef}>
            Wave Track
        </div>
    );
}

export default WaveTrack;


'use client'
import { useWavesurfer } from '@/utils/customHooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


const WaveTrack = () => {

    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        }
    }, [fileName])
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
        setIsPlaying(!isPlaying)
    }, [wavesurfer])

    useEffect(() => {
        if (!wavesurfer) return
        setIsPlaying(false)
        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
        ]
        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])


    return (
        <>
            <div ref={containerRef}>
                Wave Track
            </div>
            <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </>
    );
}

export default WaveTrack;

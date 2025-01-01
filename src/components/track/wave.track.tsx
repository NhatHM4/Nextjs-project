
'use client'
import { useWavesurfer } from '@/utils/customHooks';
import { useSearchParams } from 'next/navigation';
import { useMemo, useRef } from 'react';


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

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    return (
        <div ref={containerRef}>
            Wave Track
        </div>
    );
}

export default WaveTrack;

'use client'
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js'
const WaveTrack = () => {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const wavesurfer = WaveSurfer.create({
            container: ref.current as HTMLElement,
            waveColor: 'rgb(146, 142, 146)',
            progressColor: 'rgb(100, 0, 100)',
            url: 'http://localhost:3000/tracks/hoidanit.mp3',
        })
        wavesurfer.on('click', () => {
            wavesurfer.play()
        })
    }, []);

    return (
        <div ref={ref}>
            Wave Track
        </div>
    );
}

export default WaveTrack;

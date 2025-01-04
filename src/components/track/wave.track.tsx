
'use client'
import { useWavesurfer } from '@/utils/customHooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import './wave.scss';


const WaveTrack = () => {

    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const timeEl = useRef<HTMLDivElement>(null);
    const durationEl = useRef<HTMLDivElement>(null);
    const hoverEl = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);



    const optionsMemo: Omit<WaveSurferOptions, 'container'> = useMemo(() => {

        let gradient, progressGradient;
        if (typeof window !== 'undefined') {

            // Create a canvas gradient
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            barWidth: 2,
            height: 170,
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
            wavesurfer.on('decode', (duration) => {
                if (durationEl.current) {
                    durationEl.current.textContent = formatTime(duration);
                }
            }),
            wavesurfer?.on('timeupdate', (currentTime) => {
                if (timeEl.current) {
                    timeEl.current.textContent = formatTime(currentTime);
                }
            })
        ]
        if (containerRef.current && hoverEl.current) {
            containerRef.current.addEventListener('pointermove', (e) => {
                if (hoverEl.current) {
                    hoverEl.current.style.width = `${e.offsetX}px`;
                }
            })
        }
        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }


    return (
        <>
            <div ref={containerRef} className="waveform-container">
                Wave Track
                <div ref={timeEl} className='time'>0:00</div>
                <div ref={durationEl} className='duration'>0:00</div>
                <div ref={hoverEl} className='hover'></div>
            </div>
            <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </>
    );
}

export default WaveTrack;

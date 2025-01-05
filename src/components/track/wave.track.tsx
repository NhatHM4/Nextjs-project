
'use client'
import { useHasMounted, useWavesurfer } from '@/utils/customHooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import './wave.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


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
            barWidth: 3,
            height: 200,
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




    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 199,
            user: "username 3",
            content: "just a comment3"
        },
    ]

    const calLeft = (moment: number) => {
        return wavesurfer ? moment / 199 : 0
    }



    return (
        <div style={{ marginTop: 20 }}>
            <div
                style={{
                    display: "flex",
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
                    borderRadius: 15
                }}
            >
                <div className="left"
                    style={{
                        width: "75%",
                        height: "calc(100% - 10px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div
                                onClick={() => onPlayPause()}
                                style={{
                                    borderRadius: "50%",
                                    background: "#f50",
                                    height: "50px",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                    :
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px",
                                background: "#333",
                                fontSize: 30,
                                width: "fit-content",
                                color: "white"
                            }}>
                                Hỏi Dân IT's song
                            </div>
                            <div style={{
                                padding: "0 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white"
                            }}
                            >
                                Eric
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="waveform-container">
                        <div ref={timeEl} className='time'>0:00</div>
                        <div ref={durationEl} className='duration'>0:00</div>
                        <div ref={hoverEl} className='hover'></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "55px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc"
                                backdropFilter: "brightness(0.5)"
                            }}
                        ></div>
                        <div className='comment'>

                            {arrComments.map((comment) => {
                                return (
                                    <img key={comment.id}
                                        style={{
                                            height: 20,
                                            width: 20,
                                            position: 'absolute',
                                            top: 145,
                                            left: `calc(${calLeft(comment.moment) * 100}%)`,
                                            zIndex: 20
                                        }}
                                        src={`${comment.avatar}`} alt="avatar" />
                                )
                            })}
                        </div>

                    </div>
                </div>
                <div className="right"
                    style={{
                        width: "25%",
                        padding: 15,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div style={{
                        background: "#ccc",
                        width: 250,
                        height: 250
                    }}>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default WaveTrack;

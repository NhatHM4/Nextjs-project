
'use client'
import CommentTrack from '@/components/track/comment.track';
import LikeTrack from '@/components/track/like.track';
import { useTrackContext } from '@/lib/track.wrapper';
import { fetchDefaultImage, sendRequest } from '@/utils/api';
import { useWavesurfer } from '@/utils/customHooks';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import './wave.scss';
import Image from 'next/image';

const WaveTrack = ({ track, comments }: { track: ITrackTop | null, comments: ITrackComment[] }) => {
    const isCounted = useRef(true);
    const router = useRouter();
    const trackContext = useTrackContext();
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

    const handleIncreaseView = async () => {
        if (isCounted.current) {
            isCounted.current = false;
            const resCountView = await sendRequest<IBackendRes<ITrackTop>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
                method: 'POST',
                body: {
                    trackId: track?._id
                }
            });
            if (resCountView?.data) {
                router.refresh();
            }
        }
    }



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

    useEffect(() => {
        if (track?._id && !trackContext?.trackContext._id) {
            trackContext?.setTrackContext({
                ...track,
                isPlaying: false
            });

        }

    }, [track])

    const calLeft = (moment: number) => {
        return wavesurfer ? moment / wavesurfer.getDuration() : 0
    }

    useEffect(() => {
        if (trackContext?.trackContext.isPlaying && isPlaying) {
            wavesurfer?.pause();
        }

    }, [trackContext?.trackContext])





    return (
        <>
            <div
                style={{
                    display: "flex",
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
                    borderRadius: 15,
                    marginTop: 20
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
                                onClick={() => {
                                    onPlayPause();
                                    handleIncreaseView();
                                    if (track && wavesurfer) {

                                        trackContext?.setTrackContext({
                                            ...trackContext?.trackContext,
                                            isPlaying: false
                                        })
                                    }
                                }}
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
                                {track?.title}
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
                                {track?.description}
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

                            {comments.map((comment) => {
                                return (
                                    <Tooltip key={comment._id} title={`${comment.content}`} arrow>
                                        <Image
                                            onPointerMove={(e) => {
                                                const hover = hoverEl.current!;
                                                hover.style.width = `calc(${calLeft(comment.moment) * 100}%)`
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 145,
                                                left: `calc(${calLeft(comment.moment) * 100}%)`,
                                                zIndex: 20
                                            }}
                                            width={20}
                                            height={20}
                                            src={fetchDefaultImage(comment?.user?.type)} alt="avatar" />

                                    </Tooltip>
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
                    {
                        track && track.imgUrl
                            ?
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                width={250}
                                height={250}
                                style={{ borderRadius: 5 }}
                                alt="track"
                            />
                            :
                            <div style={{
                                background: "#ccc",
                                width: 250,
                                height: 250
                            }}>
                            </div>
                    }
                </div>
            </div>
            <Box sx={{ marginTop: 2 }}>
                <LikeTrack track={track as ITrackTop} />
            </Box>
            <CommentTrack track={track as ITrackTop} comments={comments} wavesurfer={wavesurfer} />

        </>
    )
}

export default WaveTrack;

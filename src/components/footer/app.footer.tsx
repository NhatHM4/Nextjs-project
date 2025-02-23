'use client';
import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/utils/customHooks';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const trackContext = useTrackContext();
    const playerRef = useRef<H5AudioPlayer>(null);

    useEffect(() => {
        if (playerRef.current && playerRef.current.audio.current) {
            if (trackContext?.trackContext?.isPlaying) {
                playerRef.current.audio.current.play();
            } else {
                playerRef.current.audio.current.pause();
            }
        }
    }, [trackContext?.trackContext?.isPlaying]);

    if (!hasMounted) {
        return (<></>);
    }

    return (
        <div style={{ marginTop: 50 }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#f2f2f2' }}>
                <Container sx={{ display: "flex", gap: 10 }}>
                    <AudioPlayer
                        ref={playerRef}
                        layout='horizontal-reverse'
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${trackContext?.trackContext?.trackUrl}`}  // check if track is playing
                        volume={0.5}
                        style={{ boxShadow: 'none', backgroundColor: '#f2f2f2' }}
                        onPlay={(e) => {
                            trackContext?.setTrackContext({ ...trackContext?.trackContext, isPlaying: true });
                        }}
                        onPause={(e) => {
                            trackContext?.setTrackContext({ ...trackContext?.trackContext, isPlaying: false });
                        }}

                    />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        minWidth: 100
                    }}>
                        <div style={{ color: "#ccc" }}>{trackContext?.trackContext?.title}</div>
                        <div style={{ color: "black" }}>{trackContext?.trackContext?.description}</div>
                    </div>
                </Container>
            </AppBar>
        </div>
    );
}

export default AppFooter;

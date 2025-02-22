'use client';
import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/utils/customHooks';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const trackContext = useTrackContext();

    if (!hasMounted) {
        return (<></>);
    }

    console.log("check track context", trackContext);


    return (
        <div style={{ marginTop: 50 }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#f2f2f2' }}>
                <Container sx={{ display: "flex", gap: 10 }}>
                    <AudioPlayer
                        layout='horizontal-reverse'
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        volume={0.5}
                        style={{ boxShadow: 'none', backgroundColor: '#f2f2f2' }}
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

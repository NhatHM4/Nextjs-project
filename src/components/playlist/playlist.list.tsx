'use client'
import { PlaylistPage } from "@/components/playlist/dialog.playlist";
import { TrackDialogPage } from "@/components/playlist/dialog.track";
import PlaylistSub from "@/components/playlist/playlist.sub";
import { Box, Container } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from "react";


interface IProps {
    playlists: IPlayList[],
    tracks: ITrackTop[]
}

const PlayList = ({ playlists, tracks }: IProps) => {
    const [openPlaylistPage, setOpenPlaylistPage] = useState(false);
    const [openTrackDialogPage, setTrackDialogPage] = useState(false);

    return (
        <Container sx={{ background: "#f7f7f7", borderRadius: "5px", mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                    Playlist
                </Typography>
                <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                    <Button variant="contained" onClick={() => setOpenPlaylistPage(true)}>Create playlist</Button>
                    <Button variant="contained" onClick={() => setTrackDialogPage(true)}>Create Track</Button>
                </Box>
            </Box>
            <PlaylistSub playlists={playlists} />
            <PlaylistPage
                open={openPlaylistPage}
                onClose={() => setOpenPlaylistPage(false)}
            />
            <TrackDialogPage
                open={openTrackDialogPage}
                onClose={() => setTrackDialogPage(false)}
                playlists={playlists}
                tracks={tracks}
            />
        </Container>
    );
}

export default PlayList;

'use client'
import { SimpleDialog } from "@/components/playlist/dialog.playlist";
import PlaylistSub from "@/components/playlist/playlist.sub";
import { Box, Container } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from "react";


interface IProps {
    playlists: IPlayList[]
}

const PlayList = ({ playlists }: IProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Container sx={{ background: "#f7f7f7", borderRadius: "5px", mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                    Playlist
                </Typography>
                <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                    <Button variant="contained" onClick={() => setOpen(true)}>Create playlist</Button>
                    <Button variant="contained">Create Track</Button>
                </Box>
            </Box>
            <PlaylistSub playlists={playlists} />
            <SimpleDialog
                open={open}
                onClose={() => setOpen(false)}
            />
        </Container>
    );
}

export default PlayList;

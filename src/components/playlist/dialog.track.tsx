'use client'
import { sendRequest } from '@/utils/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    playlists: IPlayList[];
    tracks: ITrackTop[];
}

export function TrackDialogPage(props: SimpleDialogProps) {
    const { onClose, open, playlists, tracks } = props;
    const [trackId, setTrackId] = useState<string[]>([]);
    const session = useSession();
    const router = useRouter();
    const [playlistId, setPlaylistId] = useState("");
    const [playlistName, setPlaylistName] = useState("");


    // Ngăn đóng khi click backdrop
    const handleClose = (event: any, reason: any) => {
        if (reason !== "backdropClick") {
            onClose();
        }
    };

    const handleUpdatePlaylist = async () => {
        if (!playlistId) {
            return;
        }
        const res = await sendRequest<IBackendRes<IPlayList>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
            method: 'PATCH',
            body: {
                id: playlistId,
                title: playlistName,
                tracks: trackId,
                isPublic: true
            },
            headers: {
                'Authorization': `Bearer ${session?.data?.access_token}`
            }
        })

        if (res.data) {
            onClose();
            await sendRequest<IBackendRes<ITrackTop>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "fetch-playlist",
                    secret: "haminhnhat711"
                }
            })
            router.refresh();
            setTrackId([]);
            setPlaylistId("");
        }
    }

    const handleChange = (event: SelectChangeEvent) => {
        setPlaylistId(event.target.value as string);
    };


    return (
        <Dialog onClose={handleClose} open={open}
            sx={{
                "& .MuiDialog-paper": { width: "600px", maxWidth: "90%", padding: "20px" } // Set width
            }} >
            <Typography variant="h6" gutterBottom>
                Thêm mới playlist:
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Chọn playlist</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={playlistId}
                    label="Chọn playlist"
                    onChange={handleChange}
                >
                    <MenuItem value={""}>&nbsp;</MenuItem>
                    {playlists.map((playlist) => (
                        <MenuItem key={playlist._id} value={playlist._id} onClick={() => setPlaylistName(playlist.title)}>
                            {playlist.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <MultipleSelectChip tracks={tracks} trackId={trackId} setTrackId={setTrackId} />

            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button variant="contained" onClick={() => handleUpdatePlaylist()}>
                    SAVE
                </Button>
            </DialogActions>
        </Dialog>
    );
}




export default function MultipleSelectChip({ tracks, trackId, setTrackId }: { tracks: ITrackTop[], trackId: string[], setTrackId: (trackId: string[]) => void }) {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<typeof trackId>) => {
        const {
            target: { value },
        } = event;
        setTrackId(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    console.log(trackId)

    return (
        <div>
            <FormControl sx={{ mt: 2, width: '100%' }}>
                <InputLabel id="demo-multiple-chip-label" >Tracks</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={trackId}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={tracks.find(track => track._id === value)?.title} />
                            ))}
                        </Box>
                    )}
                >
                    {tracks?.map((track) => (
                        <MenuItem
                            key={track._id}
                            value={track._id}
                        >
                            {track.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}


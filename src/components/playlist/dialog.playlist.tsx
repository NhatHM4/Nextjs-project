'use client'
import { sendRequest } from '@/utils/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;
    const [title, setTitle] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const session = useSession();
    const router = useRouter();

    // Ngăn đóng khi click backdrop
    const handleClose = (event: any, reason: any) => {
        if (reason !== "backdropClick") {
            onClose();
        }
    };

    const handleNewPlaylist = async () => {
        console.log(session?.data?.access_token)
        const res = await sendRequest<IBackendRes<IPlayList>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: 'POST',
            body: { title, isPublic },
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
            setTitle("");
        }
    }


    return (
        <Dialog onClose={handleClose} open={open}
            sx={{
                "& .MuiDialog-paper": { width: "600px", maxWidth: "90%", padding: "20px" } // Set width
            }} >
            <Typography variant="h6" gutterBottom>
                Thêm mới playlist:
            </Typography>
            <Box >
                <TextField
                    fullWidth
                    label="Tiêu đề"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Box>
            <FormControlLabel
                control={
                    <Switch
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                }
                label={!isPublic ? "Private" : "Public"}
                sx={{ mt: 2 }}
            />

            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button variant="contained" onClick={() => handleNewPlaylist()}>
                    SAVE
                </Button>
            </DialogActions>
        </Dialog>
    );
}


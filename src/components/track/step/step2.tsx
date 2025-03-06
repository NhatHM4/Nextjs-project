'use-client';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast/useToast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const category = [
    {
        value: 'CHILL',
        label: 'CHILL',
    },
    {
        value: 'WORKOUT',
        label: 'WORKOUT',
    },
    {
        value: 'PARTY',
        label: 'PARTY',
    }
];

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}

interface IProps {
    audio: {
        fileName: string,
        percent: number,
        uploadedTrackName: string;
    },
    setValue: (value: number) => void
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
function InputFileUpload({ handleUploadImage }: { handleUploadImage: (event: any) => void }) {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onChange={(event) => handleUploadImage(event)}

        >
            Upload files
            <VisuallyHiddenInput
                type="file"

                multiple
                accept="image/*"
            />
        </Button>
    );
}


const Step2 = ({ audio, setValue }: IProps) => {
    const toast = useToast();
    const [info, setInfo] = useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: ''
    });
    const { data: session } = useSession();


    const handleUploadImage = async (event: any) => {
        const acceptedFiles = event.target.files;
        if (acceptedFiles && acceptedFiles.length > 0) {
            const audio = acceptedFiles[0]
            const formData = new FormData();
            formData.append('fileUpload', audio)
            try {
                const res = await axios.post('http://localhost:8000/api/v1/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${session?.access_token}`,
                        'target_type': 'images'
                    }
                });
                setInfo({ ...info, imgUrl: res.data.data.fileName });
            } catch (error) {
                console.log(error);

            }

        }
    }

    useEffect(() => {
        if (audio && audio.uploadedTrackName) {
            setInfo({ ...info, trackUrl: audio.uploadedTrackName });
        }
    }, [audio])

    const createTrack = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: 'http://localhost:8000/api/v1/tracks',
            method: 'POST',
            body: info,
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            }
        });

        if (res.data) {
            setValue(0);
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }

    return (
        <Container>
            <span>{audio.fileName}</span>
            <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={audio.percent} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                background: `#ccc`,
                                width: 250,
                                height: 250
                            }}>
                                {
                                    info.imgUrl &&
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                        width={250}
                                        height={250}
                                        style={{ borderRadius: 100 }}
                                        alt="track"
                                    />
                                }

                            </div>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <InputFileUpload handleUploadImage={handleUploadImage} />
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1 } }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField fullWidth
                                value={info?.title}
                                onChange={(e) => setInfo({ ...info, title: e.target.value })}
                                label="Title"
                                variant="standard" />
                            <TextField fullWidth
                                value={info?.description}
                                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                                label="Description"
                                variant="standard" />
                            <TextField
                                sx={{
                                    mt: 3
                                }}
                                id="outlined-select-currency"
                                select
                                label="Category"
                                fullWidth
                                variant="standard"
                                value={info?.category}
                                onChange={(event) => {
                                    setInfo({ ...info, category: event.target.value })
                                }}
                            >
                                {category.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button variant="outlined" onClick={() => createTrack()}>Save</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    );
}

export default Step2;

'use-client';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { InputFileUpload } from '@/components/track/step1';
import TextField from '@mui/material/TextField';

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
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Step2 = () => {
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);


    return (
        <Container>
            <span>Your track is being uploaded</span>
            <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={progress} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                background: "#ccc",
                                width: 250,
                                height: 250
                            }}>
                            </div>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <InputFileUpload />
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1 } }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField fullWidth id="standard-basic" label="Title" variant="standard" />
                            <TextField fullWidth id="standard-basic" label="Description" variant="standard" />
                            <TextField fullWidth id="standard-basic" label="Category" variant="standard" />
                            <Button variant="outlined">Save</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Step2;

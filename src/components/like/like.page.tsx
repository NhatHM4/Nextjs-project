import { Card, CardContent, Grid, Typography } from '@mui/material';
import Image from 'next/image';
interface LikeByUserProps {
    tracks: ITrackTop[];
}
const LikeByUser = ({ tracks }: LikeByUserProps) => {
    return (
        <div>
            <div style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Hear the tracks you've liked:
                </Typography>
                <br />
                <Grid container spacing={2}>
                    {tracks.map((track, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                            <Card>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                    width={250}
                                    height={250}
                                    style={{ borderRadius: 5 }}
                                    alt="track"
                                />
                                <CardContent sx={{ padding: '10px', height: '100px' }}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {track.title}
                                    </Typography>
                                    {track.description && (
                                        <Typography variant="body2" color="textSecondary">
                                            {track?.description}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default LikeByUser;

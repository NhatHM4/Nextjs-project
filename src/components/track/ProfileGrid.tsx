'use client'
import TrackProfile from '@/components/track/TrackProfile';
import Grid from '@mui/material/Grid';

interface IProps {
    tracks: ITrackTop[];
}
export default function SpacingGrid({ tracks }: IProps) {

    return (

        <Grid sx={{ flexGrow: 1 }} container spacing={5}>
            <Grid item xs={12}>
                <Grid container spacing={4} >
                    {tracks.map((track: ITrackTop) => (
                        <Grid key={track._id} item xs={6}>
                            <TrackProfile track={track} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

        </Grid>

    );
}

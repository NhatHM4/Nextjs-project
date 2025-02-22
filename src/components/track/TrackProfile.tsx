import { useTrackContext } from '@/lib/track.wrapper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PauseIcon from '@mui/icons-material/Pause';

interface IProps {
    track: ITrackTop;
}

export default function TrackProfile({ track }: IProps) {
    const theme = useTheme();
    const trackContext = useTrackContext();

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {track.title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {track.description}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    {/* trường hợp chưa chay track này (không ở context)  hoặc ( nếu đang chạy ( ở context)  và cái nút đang là pause) */}
                    {
                        (track._id !== trackContext?.trackContext._id ||
                            track._id === trackContext?.trackContext._id && trackContext?.trackContext.isPlaying === false
                        )
                        &&
                        <IconButton aria-label="play/pause"
                            onClick={(e) => {
                                trackContext?.setTrackContext({ ...track, isPlaying: true });
                            }}
                        >
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                    }

                    {/* trường hợp đang chạy track nay */}
                    {track._id === trackContext?.trackContext._id && trackContext?.trackContext.isPlaying
                        &&
                        <IconButton aria-label="play/pause"
                            onClick={(e) => {
                                trackContext.setTrackContext({ ...track, isPlaying: false });
                            }}
                        >
                            <PauseIcon sx={{ height: 38, width: 38 }}
                            />
                        </IconButton>
                    }

                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                </Box>
            </Box>
            <CardMedia
                component="img"
                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                sx={{ width: 151, height: 151 }}
                alt="Live from space album cover"
            />
        </Card>
    );
}

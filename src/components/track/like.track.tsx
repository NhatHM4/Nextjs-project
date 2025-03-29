import { handleLikeTrackServerAction } from "@/utils/actions/action";
import { sendRequest } from "@/utils/api";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Chip, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LikeTrack = ({ track }: { track: ITrackTop }) => {
    const session = useSession();
    const [liked, setLiked] = useState(false);
    const router = useRouter();

    const handleLike = async () => {
        const resLike = await handleLikeTrackServerAction(track, liked, session?.data?.access_token ?? '');
        if (resLike.data) {
            setLiked(!liked);
            router.refresh();
        }
    }

    const fetchLikeByUser = async () => {
        const resLike = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.data?.access_token}`
            },
        });
        if (resLike.data && resLike.data.result.find((item) => item?._id === track?._id)) {
            setLiked(true);
        }
    }

    useEffect(() => {
        if (session.data) {
            fetchLikeByUser();
        }
    }, [session]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
                label="Like"
                color={liked ? 'error' : 'default'}
                icon={<FavoriteIcon />}
                onClick={() => { handleLike() }}
                variant="outlined"
                clickable />
            <div className="countPlay-Like">
                <Box display="flex" alignItems="center" gap={2} color="gray">
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <PlayArrowIcon fontSize="small" />
                        <Typography variant="body2">{track?.countPlay}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <FavoriteIcon fontSize="small" />
                        <Typography variant="body2">{track?.countLike}</Typography>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default LikeTrack;

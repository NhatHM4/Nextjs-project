import { fetchDefaultImage, sendRequest } from '@/utils/api';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

dayjs.extend(relativeTime);

interface IProps {
    track: ITrackTop;
    comments: ITrackComment[];
    wavesurfer?: any;
}

function formatSecondsToMMSS(seconds: number) {
    return dayjs().startOf('day').add(seconds, 'seconds').format('mm:ss');
}

const CommentTrack = ({ track, comments, wavesurfer }: IProps) => {
    const session = useSession();
    const router = useRouter();
    const [yourComment, setYourComment] = useState('');

    const onKeyPress = async (e: any) => {
        if (e.key === "Enter") {
            console.log('Input value', e.target.value);
            const resAddComment = await sendRequest<IBackendRes<ITrackComment>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
                method: 'POST',
                body: {
                    content: e.target.value,
                    moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                    track: track._id
                },
                headers: {
                    Authorization: `Bearer ${session.data?.access_token}`
                }
            });
            if (resAddComment.data) {
                setYourComment('');
                router.refresh();
            }
        }
    }

    const handleJumpSeek = (moment: number) => {
        wavesurfer?.seekTo(moment / wavesurfer.getDuration());
    }

    return (
        <>
            <TextField
                fullWidth
                id="standard-basic"
                label="Comment"
                variant="standard"
                style={{ marginTop: 20 }}
                value={yourComment}
                onChange={(e) => setYourComment(e.target.value)}
                inputProps={{
                    onKeyPress
                }} />
            <div className="container" style={{ marginTop: 20, display: 'flex' }}>

                <div className='left' style={{ width: '300px' }}>
                    {
                        track && track.imgUrl
                            ?
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100
                                }}
                                alt="track"
                            />
                            :
                            <div style={{
                                background: "#ccc",
                                width: 250,
                                height: 250
                            }}>
                            </div>
                    }
                    <p style={{ justifyContent: 'center' }}>{track.uploader.email}</p>
                </div>
                <div className='right' style={{ width: 'calc(100% - 300px)' }}>
                    {
                        comments.map((comment, index) => (
                            <ListItem key={index} alignItems="flex-start" >
                                <ListItemAvatar>
                                    <Avatar src={fetchDefaultImage(comment.user.type)} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" >
                                            {comment.user.email} at
                                            <span style={{ cursor: 'pointer' }} onClick={() => handleJumpSeek(comment.moment)}>
                                                {formatSecondsToMMSS(comment.moment)}
                                            </span>

                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.content}
                                        </Typography>
                                    }
                                />
                                <Typography variant="caption" color="textSecondary">
                                    {dayjs(comment.createdAt).fromNow()}
                                </Typography>
                            </ListItem>
                        ))
                    }
                </div>

            </div>
        </>
    );
}

export default CommentTrack;

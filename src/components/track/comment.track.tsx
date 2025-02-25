import { fetchDefaultImage } from '@/utils/api';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface IProps {
    track: ITrackTop;
    comments: ITrackComment[];
}

function formatSecondsToMMSS(seconds: number) {
    return dayjs().startOf('day').add(seconds, 'seconds').format('mm:ss');
}

const CommentTrack = ({ track, comments }: IProps) => {
    return (
        <>
            <TextField fullWidth id="standard-basic" label="Comment" variant="standard" style={{ marginTop: 20 }} />
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
                                            {comment.user.email} at {formatSecondsToMMSS(comment.moment)}
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

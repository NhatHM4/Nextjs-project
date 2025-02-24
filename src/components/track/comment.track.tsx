import TextField from '@mui/material/TextField';

interface IProps {
    track: ITrackTop;
    comments: ITrackComment[];
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
                    right
                </div>

            </div>
        </>
    );
}

export default CommentTrack;

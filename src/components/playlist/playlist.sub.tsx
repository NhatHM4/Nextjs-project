import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface IProps {
    playlists: IPlayList[]
}
const PlaylistSub = ({ playlists }: IProps) => {
    return (
        <Box>
            {playlists && playlists.map((item) => {
                return (
                    <Accordion key={item._id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography component="span" sx={{ fontWeight: "bold" }}>{item.title}</Typography>
                        </AccordionSummary>
                        {item.tracks && item.tracks.map((track) => {
                            return (
                                <AccordionDetails sx={{ background: "#E6E6FA", border: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }} key={track._id}>
                                    <Typography component="span">{track.title}</Typography>
                                    <PlayArrowIcon />
                                </AccordionDetails>
                            )
                        })}
                    </Accordion>
                )
            })}

        </Box>
    );
}

export default PlaylistSub;

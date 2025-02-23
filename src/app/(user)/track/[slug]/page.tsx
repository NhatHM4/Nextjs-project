
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
        method: 'GET',
    });


    return (
        <Container>
            <WaveTrack track={res?.data ?? null} />
        </Container>
    );
}

export default DetailTrackPage;

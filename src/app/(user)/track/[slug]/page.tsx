
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
        method: 'GET',
    });

    const resComment = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            trackId: params.slug,
            current: 1,
            pageSize: 10
        },
    });

    console.log(resComment);


    return (
        <Container>
            <WaveTrack track={res?.data ?? null} comments={resComment?.data?.result ?? []} />
        </Container>
    );
}

export default DetailTrackPage;

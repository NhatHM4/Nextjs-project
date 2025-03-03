
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';

import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    // fetch data
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
        method: 'GET',
    });

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Hỏi Dân IT',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
        },

    }
}



const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
        method: 'GET',
        nextOption: {
            next: { revalidate: 0 }
        },
    });

    const resComment = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            trackId: params.slug,
            current: 1,
            pageSize: 10,
            sort: '-createdAt',
        },
    });

    console.log(res?.data);


    return (
        <Container>
            <WaveTrack track={res?.data ?? null} comments={resComment?.data?.result ?? []} />
        </Container>
    );
}

export default DetailTrackPage;

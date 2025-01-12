
'use client'
import WaveTrack from '@/components/track/wave.track';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation'
const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    const searchParams = useSearchParams()
    const audio = searchParams.get('audio')
    return (
        <Container>
            <WaveTrack />
        </Container>
    );
}

export default DetailTrackPage;

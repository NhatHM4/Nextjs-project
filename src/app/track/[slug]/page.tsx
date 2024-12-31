
'use client'
import WaveTrack from '@/components/track/wave.track';
import { useSearchParams } from 'next/navigation'
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    const searchParams = useSearchParams()
    const audio = searchParams.get('audio')
    return (
        <div>
            Detail track slug
            <div><WaveTrack /></div>
        </div>
    );
}

export default DetailTrackPage;

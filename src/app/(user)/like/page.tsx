import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LikeByUser from "@/components/like/like.page";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Like Page',
    description: 'This is the like page',
}


const LikePage = async () => {

    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'GET',
        queryParams: {
            current: 1,
            pageSize: 100,
        },
        headers: {
            'Authorization': `Bearer ${session?.access_token}`
        },
        nextOption: {
            next: { tags: ["like-track"] }
        },
    });

    return (
        <Container>
            <LikeByUser tracks={res.data?.result ?? []} />
        </Container>
    );
}

export default LikePage;

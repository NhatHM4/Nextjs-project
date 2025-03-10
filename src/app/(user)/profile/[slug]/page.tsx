

import ProfileGrid from "@/components/track/ProfileGrid";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";


const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
        method: 'POST',
        body: { id: params.slug },
        nextOption: {
            next: { tags: ["profile-track"] }
        }

    });


    return (
        <Container sx={{ py: 2 }}>
            <ProfileGrid tracks={tracks?.data?.result ?? []} />
        </Container>
    );
}

export default ProfilePage;

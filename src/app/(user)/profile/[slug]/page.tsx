

import { sendRequest } from "@/utils/api";


const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
        method: 'POST',
        body: { id: params.slug },

    }); 5

    return (
        <div>
            {tracks?.data?.result?.map((track) => (
                <div key={track._id}>
                    <h3>{track.title}</h3>
                    <p>{track.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ProfilePage;

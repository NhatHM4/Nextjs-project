import PlayList from "@/components/playlist/playlist.list";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const PlaylistPage = async () => {

    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<IPlayList>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: 'POST',
        queryParams: {
            current: 1,
            pageSize: 100,
        },
        headers: {
            'Authorization': `Bearer ${session?.access_token}`
        },
        nextOption: {
            next: { tags: ["fetch-playlist"] }
        },
    });

    return (
        <PlayList playlists={res.data?.result ?? []} />
    );
}

export default PlaylistPage;

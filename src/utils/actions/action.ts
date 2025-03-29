'use server';

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const handleLikeTrackServerAction = async (track: ITrackTop, isLike: boolean, access_token: string) => {

    const resLike = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'POST',
        body: {
            track: track._id,
            quantity: isLike ? -1 : 1
        },
        headers: {
            Authorization: `Bearer ${access_token}`
        },
    });
    revalidateTag("like-track");

    return resLike;
}

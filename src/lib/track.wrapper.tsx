'use client';
import { createContext, useContext, useState } from "react";

const TrackContext = createContext<ITrackContext | null>(null)
export const useTrackContext = () => useContext(TrackContext);

export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [trackContext, setTrackContext] = useState<IShareTrack>({
        "_id": "",
        "title": "",
        "description": "",
        "category": "",
        "imgUrl": "",
        "trackUrl": "",
        "countLike": 0,
        "countPlay": 0,
        "uploader": {
            "_id": "",
            "email": "",
            "name": "",
            "role": "",
            "type": ""
        },
        "isDeleted": false,
        "createdAt": "",
        "updatedAt": "",
        "isPlaying": false
    });

    return (
        <TrackContext.Provider value={{ trackContext, setTrackContext }}>
            {children}
        </TrackContext.Provider>
    )
};


'use client'
import React from 'react'
import { useDispatch } from 'react-redux';
import { BsFillPlayFill } from 'react-icons/bs';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const PlayButton = ({ songList }) => {
    const { status } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    const handlePlayClick = (song, index) => {
        if (status !== "authenticated") {
            toast.error("Please login to play songs");
            router.push("/login");
            return;
        }
        dispatch(setActiveSong({ song, data: songList?.songs, i: index }));
        dispatch(playPause(true));
    };
    return (
        <div
            onClick={() => { handlePlayClick(songList?.songs?.[0], 0); }}
            className="flex items-center gap-2 mt-5 rounded-3xl py-2 px-3 hover:border-[#00e6e6] group w-fit cursor-pointer border border-white">
            <BsFillPlayFill size={25} className="text-gray-200 group-hover:text-[#00e6e6]" />
            <p className="text-lg font-semibold">Play</p>
        </div>
    )
}

export default PlayButton
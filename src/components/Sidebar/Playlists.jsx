"use client";
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";
import PlaylistModal from "./PlaylistModal";
import { useState } from "react";
import { useEffect } from "react";
import { deletePlaylist, getUserPlaylists } from "@/services/playlistApi";
import { MdPlaylistPlay } from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Link from "next/link";

const Playlists = ({ setShowNav }) => {
  const [show, setShow] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const getPlaylists = async () => {
      const res = await getUserPlaylists();
      if (res?.success == true) {
        setPlaylists(res?.data?.playlists);
      }
    };
    getPlaylists();
  }, [show]);

  const handleDelete = async (id) => {
    const res = await deletePlaylist(id);
    if (res?.success == true) {
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
    }
  };

  return (
    <>
      <div className="text-white mt-4 mx-2 rounded-lg transition-colors duration-200">
        <details open className="text-white detailanimatation">
          <summary className="flex cursor-pointer gap-4 items-center px-4 py-3 hover:bg-white/10 rounded-lg transition-colors duration-200">
            <FaChevronDown className="arrow text-gray-400 text-xs" />
            <div className="flex items-center gap-2">
              <p className="font-bold text-base tracking-wide">Playlists</p>
              <BiSolidPlaylist className="text-gray-400" size={20} />
            </div>
          </summary>
          <div className="flex flex-col max-h-60 overflow-y-auto px-2 mt-2">
            {playlists?.map((playlist, index) => (
              <div
                key={index}
                className="flex gap-3 hover:underline justify-between items-center px-3 w-full border-white mx-3 cursor-pointer mb-2"
              >
                <Link href={`/myPlaylists/${playlist._id}`}>
                  <div
                    onClick={() => setShowNav(false)}
                    className="flex gap-2 items-center"
                  >
                    <MdPlaylistPlay size={20} />
                    <p className="text-xl font-semibold truncate w-32">
                      {playlist.name}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-2 items-center relative">
                  <PiDotsThreeVerticalBold
                    onClick={() => setShowMenu(playlist?._id)}
                    size={25}
                    className=" text-gray-300"
                  />
                  {showMenu === playlist._id && (
                    <div
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete(playlist._id);
                      }}
                      className="absolute top-0 right-0 bg-gray-900 z-50 hover:bg-gray-800 rounded-lg p-2"
                    >
                      <p className="text-xs font-semibold flex gap-1 items-center">
                        Delete <MdOutlineDeleteOutline size={15} />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center py-4">
              <button
                onClick={() => setShow(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                <FaPlus size={12} />
                Create Playlist
              </button>
            </div>
          </div>
        </details>
        <PlaylistModal show={show} setShow={setShow} />
      </div>
      {/* overlay */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed top-0 left-0 w-full h-full z-30"
        ></div>
      )}
    </>
  );
};

export default Playlists;

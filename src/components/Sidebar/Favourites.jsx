import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";

const Favourites = ({ setShowNav }) => {
  return (
    <div className="mx-2 mt-2">
      <Link
        href="/favourite"
        className="flex cursor-pointer items-center gap-4 px-10 py-3 hover:bg-white/10 rounded-lg transition-colors duration-200"
        onClick={() => setShowNav(false)}
      >
        <p className="font-bold text-base tracking-wide text-white">
          Favourites
        </p>
        <AiFillHeart
          title="Favourites"
          size={20}
          className="text-gray-400"
        />
      </Link>
    </div>
  );
};

export default Favourites;

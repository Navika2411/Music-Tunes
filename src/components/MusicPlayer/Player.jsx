"use client";
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from "react";

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
  setSeekTime,
  appTime,
}) => {
  const ref = useRef(null);
  // eslint-disable-next-line no-unused-expressions
  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  // media session metadata:
  const artworkUrl = activeSong?.image?.[2]?.url || activeSong?.image?.[0]?.url || "";
  
  const mediaMetaData = activeSong?.name
    ? {
        title: activeSong?.name,
        artist: activeSong?.primaryArtists || "Unknown Artist",
        album: activeSong?.album?.name || "Unknown Album",
        artwork: artworkUrl ? [
          {
            src: artworkUrl,
            sizes: "500x500",
            type: "image/jpg",
          },
        ] : [],
      }
    : null;

  useEffect(() => {
    // Check if the Media Session API is available and metadata is valid
    if ("mediaSession" in navigator && mediaMetaData) {
      try {
        // Set media metadata
        navigator.mediaSession.metadata = new window.MediaMetadata(mediaMetaData);

        // Define media session event handlers
        navigator.mediaSession.setActionHandler("play", onPlay);
        navigator.mediaSession.setActionHandler("pause", onPause);
        navigator.mediaSession.setActionHandler("previoustrack", onPreviousTrack);
        navigator.mediaSession.setActionHandler("nexttrack", onNextTrack);
        navigator.mediaSession.setActionHandler("seekbackward", () => {
          setSeekTime(appTime - 5);
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
          setSeekTime(appTime + 5);
        });
      } catch (error) {
        console.error("MediaSession error:", error);
      }
    }
  }, [activeSong?.id, activeSong?.name]); // Trigger on song change
  // media session handlers:
  const onPlay = () => {
    handlePlayPause();
  };

  const onPause = () => {
    handlePlayPause();
  };

  const onPreviousTrack = () => {
    handlePrevSong();
  };

  const onNextTrack = () => {
    handleNextSong();
  };

  useEffect(() => {
    ref.current.volume = volume;
  }, [volume]);
  // updates audio element only on seekTime change (and not on each rerender):
  useEffect(() => {
    ref.current.currentTime = seekTime;
  }, [seekTime]);

  return (
    <>
      <audio
        src={activeSong?.downloadUrl?.[4]?.url || activeSong?.downloadUrl?.[3]?.url || activeSong?.downloadUrl?.[activeSong?.downloadUrl?.length - 1]?.url}
        ref={ref}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
      />
    </>
  );
};

export default Player;

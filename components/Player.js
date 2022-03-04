/* eslint-disable @next/next/no-img-element */
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import useSpotify from '../customHooks/useSpotify'
import useSongInfo from '../customHooks/useSongInfo'
import { debounce } from "lodash"
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import { handlePlayAndPauseOfPlayer, toggleTrackRepeat } from '../utils';
import { playlistState } from '../globalState/playlistsAtom';

function Player() {
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const { data: session } = useSession(); // get the current logged in user session
    const playlist = useRecoilValue(playlistState); // Atom global state
    const [{ currentTrackId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [volume, setVolume] = useState(50); // keeps state for the current volume range the user is on
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song


    const debouncedAdjustVolume = useCallback((volume) => {
        // debounced function created with lodash
        const debouncedReturnedFromLodash = debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err => console.log(err));

        }, 500);
        debouncedReturnedFromLodash(volume);
    }, [spotifyApi]);

    useEffect(() => {
        // handles event when the volume range has been changed in the UI
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume, debouncedAdjustVolume]);

    useEffect(() => {
        // on every first render set the volume to 50
        if (spotifyApi.getAccessToken()) {
            setVolume(50);
        }
    }, [spotifyApi, session,])

    return (
        <div className='text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            {/* LEFT */}
            <div className='flex items-center space-x-4'>
                <img
                    className='hidden md:inline h-10 w-10'
                    src={songInfo?.album?.images[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* CENTER */}
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon onClick={() => toggleTrackRepeat()} className='button hover:scale-125' />
                <RewindIcon
                    onClick={() => spotifyApi.skipToPrevious({ uri: [playlist?.uri] })}
                    className='button hover:scale-125' />

                {
                    isPlaying ? (
                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='button hover:scale-125 w-10 h-10' />
                    ) : (
                        <PlayIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='button hover:scale-125 w-10 h-10' />
                    )
                }
                <FastForwardIcon
                    onClick={() => spotifyApi.skipToNext({ uri: [playlist?.uri] })}
                    className='button hover:scale-125' />
            </div>

            {/* RIGHT */}
            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeOffIcon
                    onClick={(e) => setVolume(1)}
                    className='button hover:scale-125' />
                <input
                    className='w-14 md:w-28'
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    type="range"
                    min={0}
                    max={100} />
                <VolumeUpIcon
                    onClick={() => volume < 2 ? setVolume(50) : setVolume(volume)}
                    className='button hover:scale-125' />
            </div>
        </div>
    )
}

export default Player
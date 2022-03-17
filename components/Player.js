/* eslint-disable @next/next/no-img-element */
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import useSpotify from '../customHooks/useSpotify'
import useSongInfo from '../customHooks/useSongInfo'
import { debounce } from "lodash"
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import { handlePlayAndPauseOfPlayer, handleTrackSkips, toggleTrackRepeat } from '../utils';
import { playlistState } from '../globalState/playlistsAtom';

function Player() {
    // console.log('pLAYER');
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const { data: session } = useSession(); // get the current logged in user session
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [volume, setVolume] = useState(50); // keeps state for the current volume range the user is on
    const [isTrackOnRepeat, setIsTrackOnRepeat] = useState(false); // keeps state if the current playing track is on repeat
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song


    const debouncedAdjustVolume = useCallback((volume) => {
        // debounced function created with lodash
        const debouncedReturnedFromLodash = debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err => console.log(err?.body));

        }, 500);
        debouncedReturnedFromLodash(volume);
    }, [spotifyApi]);

    useEffect(() => {
        // handles event when the volume range has been changed in the UI
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume, debouncedAdjustVolume]);

    // useEffect(() => {
    //     // on every first render set the volume to 50
    //     if (spotifyApi.getAccessToken()) {
    //         setVolume(50);
    //     }
    // }, [spotifyApi, session,])
    return (
        <div className='text-white h-24 bg-gradient-to-b  from-black to-gray-900 flex items-center text-xs md:text-base md:px-8 md:justify-between'>
            {/* LEFT */}
            <div className='flex items-center space-x-4 max-w-[80px] md:max-w-[100%]'>
                <img
                    className='hidden md:inline h-12 w-12'
                    src={songInfo?.album?.images[0]?.url} alt="" />
                <div>
                    <h3 className='text-[10px] md:text-sm'>{songInfo?.name}</h3>
                    <p className='text-[8px] text-gray-500 md:text-xs'>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* CENTER */}
            <div className='flex flex-1 items-center justify-evenly md:max-w-[300px]'>
                <SwitchHorizontalIcon
                    onClick={() => toggleTrackRepeat(isTrackOnRepeat, setIsTrackOnRepeat, spotifyApi)}
                    className={`button hover:scale-125 ${isTrackOnRepeat ? "text-[#1ED760]" : ""}`} />
                <RewindIcon
                    onClick={() => handleTrackSkips("PREV", setCurrentTrackId, spotifyApi)}
                    className='button hover:scale-125' />

                {
                    isPlaying ? (
                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='button hover:scale-125 w-10 h-10' />
                    ) : (
                        <PlayIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='button hover:scale-125 w-10 h-10' />
                    )
                }
                <FastForwardIcon
                    onClick={() => handleTrackSkips("NEXT", setCurrentTrackId, spotifyApi)}
                    className='button hover:scale-125' />
            </div>

            {/* RIGHT */}
            <div className='flex items-center space-x-3 md:space-x-4 justify-end '>
                <VolumeOffIcon
                    onClick={(e) => setVolume(1)}
                    className='button hidden hover:scale-125 md:block' />
                <input
                    className='w-14 md:w-28'
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    type="range"
                    min={0}
                    max={100} />
                <VolumeUpIcon
                    onClick={() => volume < 2 ? setVolume(50) : setVolume(volume)}
                    className='button hidden hover:scale-125 md:block' />
            </div>
        </div>
    )
}

export default Player
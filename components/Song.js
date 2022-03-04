/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime, getCorrectDate } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { PlayIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { playSong } from "../utils"
import { playlistsIdState } from '../globalState/playlistsAtom';

function Song({ order, track, addedAt }) {
    const spotifyApi = useSpotify();
    const playlistId = useRecoilValue(playlistsIdState);
    const [{ currentTrackId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const isTrackActive = true; //track?.preview_url; // checker if song is still live on spotify platform

    return (
        <div className={`${isTrackActive ? "group" : ""} grid grid-cols-2 ${!isTrackActive ? "opacity-40" : ""} text-gray-500 py-4  hover:bg-gray-900 rounded-lg px-5`}>
            <div className='flex items-center space-x-4'>
                <p className='group-hover:hidden'>{order + 1}</p>
                <p onClick={() => playSong(track, setCurrentTrackId, setIsPlaying, playlistId, spotifyApi)}><PlayIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                <img
                    className='h-10 w-10'
                    src={track?.album?.images[0]?.url}
                    alt="Track Picture" />
                <div>
                    <p className='w-36 lg:w-64 max-w-[60px] truncate text-white text-sm md:max-w-[200px] lg:max-w-[100%]'>{track?.name}</p>
                    <p className=' text-sm w-[100%] max-w-[50px] truncate md:max-w-[150px] lg:max-w-[250px]'>{
                        track?.artists.map((artist, i) => (
                            <Link key={artist?.id} href={'/'}>
                                <a className='hover:underline cursor-pointer w-max inline'>{`${artist?.name} ${track?.artists.length > (i + 1) ? "," : ""}`}</a>
                            </Link>
                        ))
                    }</p>
                </div>
            </div>

            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <Link href={'/'}>
                    <a className='w-40 hidden text-[13px] md:inline hover:underline'>
                        {track?.album?.name}
                    </a>
                </Link>
                <p className='hidden text-[13px] lg:inline'>{getCorrectDate(addedAt)}</p>
                <p className='text-sm'>{convertMsToTime(track?.duration_ms, true)}</p>
            </div>

        </div>
    )
}

export default Song
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime, getCorrectDate } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { PlayIcon, BadgeCheckIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { playSong } from "../utils"
import { playlistsIdState } from '../globalState/playlistsAtom';

function Song({ order, track, addedAt, ...props }) {
    const spotifyApi = useSpotify();
    const playlistId = useRecoilValue(playlistsIdState);
    const [{ currentTrackId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [isTrackSelected, setIsTrackSelected] = useState(false); // keeps state if a track has been seleceted for a playlist
    useEffect(() => {
        // reset all seceted tracks to false once is user cancle playlist selection
        if (!props.isCreatePlaylist) setIsTrackSelected(false);
    }, [props.isCreatePlaylist])
    const handleTrackAddToPlaylist = () => {
        if (!props.isCreatePlaylist) return // return if user isn't current creating a playlist
        if (isTrackSelected) props.setSelectedTracks(props.selectedTracks.filter(sTrack => sTrack?.id !== track?.id)) // remove if track has already been picked
        if (!isTrackSelected) props.setSelectedTracks([...props.selectedTracks, track]) // add if track hasnt been picked
        setIsTrackSelected(!isTrackSelected)
    }

    return (
        <div
            onClick={handleTrackAddToPlaylist}
            className={`group grid grid-cols-2 text-gray-500 py-4  hover:bg-gray-900 rounded-lg px-5`}>
            <div className='flex items-center space-x-4'>
                {   // if user is currently picking a playlist open picker icon
                    props.isCreatePlaylist ?
                        <div>
                            {isTrackSelected ?
                                <BadgeCheckIcon className='w-4 h-4 text-[#1ED760]' />
                                :
                                <span className='block p-[5px] rounded-full border border-[#bdbaba]'></span>
                            }

                        </div>
                        :
                        <>
                            <p className='group-hover:hidden'>{order + 1}</p>
                            <p onClick={() => playSong(track, setCurrentTrackId, setIsPlaying, playlistId, spotifyApi)}><PlayIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                        </>
                }


                <img
                    className='h-10 w-10'
                    src={track?.album?.images[0]?.url}
                    alt="Track Picture" />
                <div>
                    <p className='w-36 lg:w-64 max-w-[60px] truncate text-white text-sm md:max-w-[200px] lg:max-w-[100%]'>{track?.name}</p>
                    <p className='group-hover:text-white text-sm w-[100%] max-w-[50px] truncate md:max-w-[150px] lg:max-w-[250px]'>{
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
                    <a className='group-hover:text-white w-40 hidden text-[13px] md:w-fit md:inline hover:underline'>
                        {track?.album?.name}
                    </a>
                </Link>
                {
                    addedAt && <p className='hidden text-[13px] lg:inline'>{getCorrectDate(addedAt)}</p>
                }

                <p className='text-sm'>{convertMsToTime(track?.duration_ms, true)}</p>
            </div>

        </div>
    )
}

export default Song
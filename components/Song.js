/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime, getCorrectDate } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { PlayIcon, BadgeCheckIcon, PauseIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { handlePlayAndPauseOfPlayer, playSong, removeTrackFromPlaylist } from "../utils"
import { playlistsIdState, playlistState } from '../globalState/playlistsAtom';
import useSongInfo from '../customHooks/useSongInfo'
import Loading from './Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function Song({ order, track, addedAt, type, ...props }) {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song
    const playlistId = useRecoilValue(playlistsIdState); //Atom global state
    const playlist = useRecoilValue(playlistState);  // Atom global state
    const [{ currentTrackId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [isTrackSelected, setIsTrackSelected] = useState(false); // keeps state if a track has been seleceted for a playlist
    const router = useRouter();

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
            className={`group grid grid-cols-2 text-gray-500 py-4  hover:bg-gray-900 rounded-lg px-3 md:px-5`}>
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
                        : (songInfo?.id === track?.id && isPlaying) ? // else if the track is the current playing track or is playing
                            <>
                                <Loading
                                    size={15}
                                    type={'Audio'}
                                    color={"#1ED760"}
                                    style={"group-hover:hidden"}
                                />
                                <p onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)}><PauseIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                            </>
                            :
                            //else display list-index and playIcon
                            <>
                                <p className='group-hover:hidden'>{order + 1}</p>
                                <p onClick={() => playSong(track, setCurrentTrackId, setIsPlaying, playlistId, spotifyApi)}><PlayIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                            </>
                }


                <img
                    className='h-10 w-10'
                    src={track?.album?.images[0]?.url}
                    alt="Track Picture" />
                <div className='w-fit'>
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
                    <a className='group-hover:text-white w-40  hidden text-[13px] md:min-w-[151px] md:inline hover:underline'>
                        <span>{track?.album?.name}</span>
                    </a>
                </Link>
                {
                    addedAt && <p className='hidden text-[13px] lg:inline'>{getCorrectDate(addedAt)}</p>
                }

                <div className='text-sm flex'>
                    <span>{convertMsToTime(track?.duration_ms, true)}</span>
                    {
                        // if its a playlist and playlist is for user, be able to remove track
                        (type === 'playlist' && playlist?.owner?.id === session?.user?.username) && <span
                            title='Remove Track'
                            onClick={() => removeTrackFromPlaylist(order, playlist, router, spotifyApi)}
                            className=' hidden group-hover:block cursor-pointer'
                        >
                            <XIcon className='w-4 h-4 ml-4' /></span>
                    }
                </div>

            </div>

        </div>
    )
}

export default Song
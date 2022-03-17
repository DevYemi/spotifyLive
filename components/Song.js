/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime, getCorrectDate } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { PlayIcon, BadgeCheckIcon, PauseIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { handlePlayAndPauseOfPlayer, playSong, removeTrackFromPlaylist } from "../utils"
import { playlistState } from '../globalState/playlistsAtom';
import Loading from './Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ExplicitIcon from '@mui/icons-material/Explicit';

function Song({ order, track, addedAt, type, songInfo, isPlaying, parentId, ...props }) {
    console.log('SONG');
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const playlist = useRecoilValue(playlistState);  // Atom global state
    const setIsPlaying = useSetRecoilState(isPlayingState); // Atom global state
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // Atom global state
    const [isTrackSelected, setIsTrackSelected] = useState(false); // keeps state if a track has been seleceted for a playlist
    const router = useRouter();

    useEffect(() => {
        // reset all seceted tracks to false once is user cancle playlist selection
        if (!props.topTrackIsCreatePlaylist) setIsTrackSelected(false);
    }, [props.topTrackIsCreatePlaylist])

    useEffect(() => {
        // check if track has been seleceted for playlist creation and update ui
        const selected = props?.selectedTracks?.filter(sTrack => sTrack?.id === track?.id);
        if (selected?.length > 0) return setIsTrackSelected(true);
    }, [props, track])

    const handleTrackAddToPlaylist = () => {
        if (!props.topTrackIsCreatePlaylist) return // return if user isn't current creating a playlist
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
                    props.topTrackIsCreatePlaylist ?
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
                                <p onClick={() => playSong(track, setCurrentTrackId, setIsPlaying, playlist?.id, parentId, spotifyApi)}><PlayIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                            </>
                }


                <img
                    className='h-10 w-10'
                    src={track?.album?.images[0]?.url}
                    alt="Track Picture" />
                <div className='w-fit'>
                    <p className='w-36 lg:w-64 max-w-[60px] truncate text-white text-sm md:max-w-[200px] lg:max-w-[100%]'>{track?.name}</p>
                    <p className='group-hover:text-white text-sm w-[100%] max-w-[110px] truncate md:max-w-[160px] lg:max-w-[250px]'>
                        {track?.explicit && <ExplicitIcon className='!h-4 !w-4 mr-1' />}
                        {
                            track?.artists.map((artist, i) => (
                                <Link key={`${artist?.id} ${i}`} href={artist?.external_urls?.spotify}>
                                    <a
                                        target="_blank"
                                        className='hover:underline cursor-pointer w-max inline'>{`${artist?.name} ${track?.artists.length >
                                            (i + 1) ? "," : ""}`}
                                    </a>
                                </Link>
                            ))
                        }</p>
                </div>
            </div>

            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <Link href={`/album/${track?.album?.id}`}>
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
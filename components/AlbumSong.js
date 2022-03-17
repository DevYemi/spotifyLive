/* eslint-disable @next/next/no-img-element */
import { BadgeCheckIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil';
import useSpotify from '../customHooks/useSpotify';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import { convertMsToTime } from '../lib/time';
import { handlePlayAndPauseOfPlayer, playSong } from '../utils';
import ExplicitIcon from '@mui/icons-material/Explicit';
import Loading from './Loading'

function AlbumSong({ order, track, songInfo, isPlaying, albumIsCreatePlaylist, parentId, albumDetails }) {
    const spotifyApi = useSpotify();
    const setIsPlaying = useSetRecoilState(isPlayingState); // Atom global state
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // Atom global state
    const [isTrackSelected, setIsTrackSelected] = useState(false); // keeps state if a track has been seleceted for a playlist

    return (
        < div
            className={`group flex justify-between text-gray-500 py-4  hover:bg-gray-900 rounded-lg px-3 md:px-5`}>
            < div className='flex items-center space-x-4'>
                {   // if user is currently picking a playlist open picker icon
                    albumIsCreatePlaylist ?
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
                                <p onClick={() => playSong(track, setCurrentTrackId, setIsPlaying, albumDetails?.id, parentId, spotifyApi)}><PlayIcon className={`w-5 h-5 hidden group-hover:block`} /></p>
                            </>
                }

                <div className='w-fit'>
                    <p className='w-36 lg:w-64 max-w-[60px] truncate text-white text-sm md:max-w-[200px] lg:max-w-[100%]'>{track?.name}</p>
                    <p className='group-hover:text-white text-sm w-[100%] max-w-[120px] truncate md:max-w-[170px] lg:max-w-[250px]'>
                        {track?.explicit && <ExplicitIcon className='!h-4 !w-4 mr-1' />}
                        {
                            track?.artists.map((artist, i) => (
                                <Link key={`${artist?.id} ${i}`} href={artist?.external_urls?.spotify}>
                                    <a
                                        target="_blank"
                                        className='hover:underline cursor-pointer w-max inline'>
                                        {`${artist?.name} ${track?.artists.length > (i + 1) ? "," : ""}`}
                                    </a>
                                </Link>
                            ))
                        }</p>
                </div>
            </div>


            <div className='text-sm flex'>
                < span>{convertMsToTime(track?.duration_ms, true)}</span>
            </div>


        </div>
    )
}
export default AlbumSong
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getSession, useSession } from 'next-auth/react'
import { debounce, shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, playlistState } from '../globalState/playlistsAtom';
import Songs from './Songs'
import HeaderNav from './HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../lib/time';
import { MusicNoteIcon, SearchCircleIcon, SearchIcon } from '@heroicons/react/solid';
import { PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { isModalOpenState } from '../globalState/displayModalAtom';
import useSpotify from '../customHooks/useSpotify';
import { useRouter } from 'next/router';

const colors = [
    // random colors created to be shuffled
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-orange-500",
]

function PlaylistInfo({ playlist }) {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null); // keeps state of the current color that was selected after shuffle
    const playlistId = useRecoilValue(playlistsIdState); // Atom global state
    const [, setPlaylist] = useRecoilState(playlistState); // Atom global state
    const [, setIsModalOpen] = useRecoilState(isModalOpenState); //Atom global state
    const [foundTracks, setFoundTracks] = useState({}); // keeps state of the found Tracks
    const router = useRouter();
    let debounceduserSearchInput = useRef() // keeps debounce function for TracksearchInput
    console.log(foundTracks)

    const addTrackToPlaylist = (track) => {
        const isTrackAlreadyAdded = playlist?.tracks?.items.filter(item => item?.track?.id === track?.id)
        console.log(isTrackAlreadyAdded)
        if (isTrackAlreadyAdded.length > 0) return
        spotifyApi.addTracksToPlaylist(playlist?.id, [track?.uri])
            .then(function (data) {
                router.push(router.asPath)
                console.log('Added tracks to playlist!');
            }).catch(err => console.log(err))
    }


    useEffect(() => {
        // On First Render get a debounce function and set it
        debounceduserSearchInput.current = debounce((userSearchInput) => {
            console.log(spotifyApi.searchTracks)
            spotifyApi.searchTracks(userSearchInput, { limit: 50 })
                .then(function (data) {
                    setFoundTracks(data?.body?.tracks)
                    console.log('Search by "Love"', data.body);
                }).catch(err => console.log(err))

        }, 1000);
    }, [spotifyApi])

    useEffect(() => {
        // shuffle colors array and select one
        setFoundTracks({})
        setColor(shuffle(colors).pop())
    }, [playlistId]);

    useEffect(() => {
        // Scroll to the top on every first render
        const playlistInfo = document.querySelector(".PLAYLIST");
        if (playlistInfo) {
            playlistInfo.scrollTo(0, 0);
        }
    }, [playlistId])
    useEffect(() => {
        // set playlist details to global state on first render
        setPlaylist(playlist);
    }, [playlistId, session, setPlaylist, playlist]);
    return (
        <div className='PLAYLIST flex-grow scrollbar-style text-white overflow-scroll h-[90vh]'>
            <HeaderNav color={color} gsapTrigger={'.PLAYLIST-SECTION-1'} gsapScroller={'.PLAYLIST'} />
            <section className={`PLAYLIST-SECTION-1 flex flex-col items-center space-x-7 bg-gradient-to-b ${color} to-black  text-white p-8 md:flex-row md:items-end md:h-80`}>
                <div
                    onClick={() => playlist?.owner?.id === session?.user?.username && setIsModalOpen({ type: 'EDIT-PLAYLIST', open: true })}
                    className=' group relative shadow-2xl flex justify-center items-center h-[179px] w-[179px] bg-[#282828] cursor-pointer '>
                    <img
                        className='h-full object-cover'
                        src={playlist?.images[0]?.url}
                        alt='' />
                    <div className='absolute group-hover:bg-[#28282859] w-full h-full flex justify-center items-center'>
                        {
                            !playlist?.images[0]?.url && <MusicNoteIcon className='h-12 w-12 text-[#7F7F7F] group-hover:hidden' />
                        }

                        <PencilIcon className='h-12 w-12 hidden text-[#7F7F7F] group-hover:block' />
                    </div>

                </div>

                <div className='mt-4 md:mt-0'>
                    <p className='text-[.7rem]'>PLAYLIST</p>
                    <div
                        onClick={() => playlist?.owner?.id === session?.user?.username && setIsModalOpen({ type: 'EDIT-PLAYLIST', open: true })}
                        className={`${playlist?.owner?.id === session?.user?.username && 'cursor-pointer'}`}>
                        <h1 className='text-1xl md:text-5xl xl:text-6xl font-bold'>{playlist?.name}</h1>
                        <p className='text-sm mt-4 text-gray-400'>{playlist?.description}</p>
                    </div>
                    <span className='text-sm font-light hover:underline '>
                        <Link href="/">
                            <a>{playlist?.owner?.display_name}</a>
                        </Link>
                    </span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light'>{playlist?.followers?.total} Likes</span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light '>{playlist?.tracks?.total} songs,</span>
                    <span className='text-xs font-light ml-1 text-gray-300 '>{calBodyOfWorkDuration(playlist)}</span>


                </div>
            </section>
            <section className='PLAYLIST-SECTION-2' >
                <Songs />
            </section>
            {
                playlist?.owner?.id === session?.user?.username &&
                <section className="PLAYLIST-SECTION-3 text-white px-8 mt-4">
                    {/* SEARCH FOR NEW SONGS */}
                    <div className='flex justify-between items-center'>
                        <div className='md:min-w-[350px]'>
                            <p>Lets Find Something For Your Playlist</p>
                            <div className='mt-5 relative'>
                                <input
                                    onChange={(e) => debounceduserSearchInput.current(e.target.value)}
                                    className='w-full py-2 pl-8 pr-1 rounded-md bg-[#2D2D2D] outline-none border-0 '
                                    placeholder='Search for songs or episodes'
                                    type="text" />
                                <SearchIcon className='w-5 h-5 absolute text-[#6a6767] top-[11px] left-[5px] ' />
                            </div>
                        </div>
                        <XCircleIcon
                            onClick={() => document.querySelector('.PLAYLIST-SECTION-3').style.display = 'none'}
                            className='h-10 w-10 hidden cursor-pointer md:block' />
                    </div>
                    {
                        foundTracks?.items?.length > 0 &&
                        foundTracks?.items.map(track => (
                            <div key={track?.id}
                                className='flex justify-between items-center px-8 my-5 '>
                                <img
                                    className='h-10 w-10 rounded-sm'
                                    src={track?.album?.images[0].url}
                                    alt='' />
                                <p className='text-[12px] font-light'>{track?.name}</p>
                                <button
                                    onClick={() => addTrackToPlaylist(track)}
                                    className='border border-[#ffffff] text-[#706f6f] py-2 px-4 rounded-3xl'>Add</button>
                            </div>
                        ))

                    }

                </section>
            }

        </div>
    )
}

export default PlaylistInfo


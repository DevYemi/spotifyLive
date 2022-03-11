/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { debounce, shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, playlistState } from '../globalState/playlistsAtom';
import Songs from './Songs'
import HeaderNav from './HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../lib/time';
import { MusicNoteIcon, SearchIcon, XIcon } from '@heroicons/react/solid';
import { PencilIcon } from '@heroicons/react/outline';
import { isModalOpenState } from '../globalState/displayModalAtom';
import useSpotify from '../customHooks/useSpotify';
import { useRouter } from 'next/router';
import Loading from './Loading';
import SearchBox from './SearchBox';
import { hasScrollReachedBottom } from '../utils';


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
    const [searchLoading, setSearchLoading] = useState(false) // keeps loading state
    const [foundTracks, setFoundTracks] = useState({}); // keeps state of the found Tracks
    const searchDiv = useRef() // search Div for new tracks
    const searchInput = useRef() // search Input for new tracks
    const router = useRouter();
    let debounceduserSearchInput = useRef() // keeps debounce function for TracksearchInput

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
        // reset this values on first render or when the playlistId changes
        setFoundTracks({})
        if (searchInput.current) searchInput.current.value = ''
        if (searchDiv.current) searchDiv.current.style.display = 'block'
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
        <div
            onScroll={(e) => playlist?.owner?.id === session?.user?.username && hasScrollReachedBottom(e, searchInput, foundTracks, '.PLAYLIST', debounceduserSearchInput)}
            className='PLAYLIST flex-grow scrollbar-style pb-[1em] text-white overflow-scroll h-[90vh]'>
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
                <section ref={searchDiv} className="PLAYLIST-SECTION-3 text-white px-8 mt-4">
                    {/* SEARCH FOR NEW SONGS */}
                    <SearchBox
                        foundTracks={foundTracks}
                        searchInput={searchInput}
                        setSearchLoading={setSearchLoading}
                        setFoundTracks={setFoundTracks}
                        parentClass={'.PLAYLIST-SECTION-3'}
                        debounceduserSearchInput={debounceduserSearchInput}
                    />

                    {
                        foundTracks?.items?.length > 0 &&
                        foundTracks?.items.map(track => (
                            <div key={track?.id}
                                className='flex justify-between items-center px-8 my-5 '>
                                <img
                                    className='h-10 w-10 rounded-sm'
                                    src={track?.album?.images[0].url}
                                    alt='' />
                                <p className='text-[12px] font-light max-w-[40%]'>{track?.name}</p>
                                <button
                                    onClick={() => addTrackToPlaylist(track)}
                                    className='border border-[#ffffff] text-[#706f6f] py-2 px-4 rounded-3xl'>Add</button>
                            </div>
                        ))

                    }
                    {
                        searchLoading &&
                        <Loading
                            size={90}
                            type={'Rings'}
                            color={"#282828"}
                            style={"flex justify-center"}
                        />
                    }




                </section>
            }

        </div>
    )
}

export default PlaylistInfo


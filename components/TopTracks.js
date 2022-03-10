import React, { useEffect, useState } from 'react'
import HeaderNav from './HeaderNav'
import Song from './Song';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, userPlaylistsState } from '../globalState/playlistsAtom';
import { ClipboardListIcon, ClockIcon } from '@heroicons/react/solid'
import { topTracksState } from '../globalState/topTracksAtom';
import { createNewPlaylist } from '../utils';
import useSpotify from '../customHooks/useSpotify';

function TopTracks({ topTracks }) {
    const spotifyApi = useSpotify(); // custom hooks
    const [, setTopTracks] = useRecoilState(topTracksState) // Atom global state
    const [isCreatePlaylist, setIsCreatePlaylist] = useState(false); // keeps state if a user clicked on the create playlist icon
    const [selectedTracks, setSelectedTracks] = useState([]); // keeps state of all the selected playlist by the user
    const userPlaylists = useRecoilValue(userPlaylistsState); // Atom Global State 
    const router = useRouter();
    const timeRangeType = router?.query?.time_range


    useEffect(() => {
        // set Top Tracks Lists to global state
        setTopTracks(topTracks)
    }, [topTracks, setTopTracks]);



    return (
        <div className='TOP-TRACKS-WR text-white flex-1 overflow-y-scroll scrollbar-style'>
            <HeaderNav color={"red"} gsapScroller={'.TOP-TRACKS-WR'} gsapTrigger={'.TOP-TRACKS'} />
            <div className='TOP-TRACKS relative mt-[5em]'>
                <h1 className='text-[4rem] text-center md:text-[3rem]'>Your Top Tracks</h1>
                <div className='w-fit mx-auto my-[2em] mb-8'>
                    <Link href={'/top-tracks/short_term'}>
                        <a className={`${timeRangeType === "short_term" ? 'timeRangeActive' : ""}`}>
                            4 WEEKS
                        </a>
                    </Link>
                    <Link href={'/top-tracks/medium_term'}>
                        <a className={`mx-[1em] ${timeRangeType === 'medium_term' ? 'timeRangeActive' : ""} md:mx-[3em]`}>
                            6 MONTHS
                        </a>
                    </Link>
                    <Link href={'/top-tracks/long_term'}>
                        <a className={`${timeRangeType === "long_term" ? 'timeRangeActive' : ""}`}>
                            ALL TIME
                        </a>
                    </Link>
                </div>
                <div
                    onClick={() => setIsCreatePlaylist(!isCreatePlaylist)}
                    className='flex items-center justify-center mx-auto my-10 w-fit py-3 px-2 rounded-md bg-[#111827] cursor-pointer hover:bg-[#1e2636]'>
                    <ClipboardListIcon className='h-5 w-5 text-gray-300' />
                    <p className='ml-3 text-sm text-gray-300'>{isCreatePlaylist ? 'Cancel' : 'Create a Playlist From Your Favourite Tracks'}</p>
                </div>
                <div className='px-8 flex flex-col space-y-1'>
                    <div className='grid px-5 uppercase text-sm font-bold grid-cols-2 text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                        <p className=''># Title</p>

                        <div className='flex items-center justify-between ml-auto md:ml-0'>
                            <p className='w-40 hidden md:inline'>Album</p>
                            <p className=''><ClockIcon className='h-5 w-5' /></p>
                        </div>
                    </div>
                    {
                        topTracks.map((track, i) => (
                            <Song
                                key={track?.id}
                                track={track}
                                addedAt={false}
                                order={i}
                                isCreatePlaylist={isCreatePlaylist}
                                setSelectedTracks={setSelectedTracks}
                                selectedTracks={selectedTracks}
                            />
                        ))
                    }
                </div>
                {
                    selectedTracks.length > 0 &&
                    <span
                        onClick={() => createNewPlaylist(selectedTracks, router, userPlaylists, spotifyApi)}
                        className='fixed p-5 text-gray-300 text-xs rounded-full bg-[#1ED760] w-fit bottom-[109px] right-5'>Create</span>
                }

            </div>
        </div>
    )
}

export default TopTracks

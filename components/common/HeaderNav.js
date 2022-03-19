/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useSession, signOut } from 'next-auth/react'
import { headerNavAnimations, sidebarAnimation } from '../../lib/gsapAnimation'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState } from '../../globalState/playlistsAtom';
import { MenuIcon, PauseIcon, PlayIcon, XCircleIcon } from '@heroicons/react/solid';
import { currentTrackIdState, isPlayingState } from '../../globalState/songAtom';
import { handlePlayAndPauseOfPlayer, startPlayingListOfSongs } from '../../utils';
import useSpotify from '../../customHooks/useSpotify';
import { isSidebarOpenState } from '../../globalState/sidebarAtom'
import { useRouter } from 'next/router';
import { topTracksState } from '../../globalState/topTracksAtom'
import { albumDetailsState } from '../../globalState/albumAtom'

function HeaderNav({ color, gsapTrigger, gsapScroller }) {
    // console.log('haeder nav');
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const playlist = useRecoilValue(playlistState) // Atom global state 
    const topTracks = useRecoilValue(topTracksState) // Atom global state 
    const albumDetails = useRecoilValue(albumDetailsState) // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [{ parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState); // Atom global state
    const [headerListOfSongsDetails, setHeaderListOfSongsDetails] = useState({}); // keeps state of the details of the body of work thats currently playing
    const { pathname, query: { time_range } } = useRouter()
    const handlePlay = () => {
        if (pathname.includes('playlist')) return startPlayingListOfSongs(playlist, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi);
        if (pathname.includes('album')) return startPlayingListOfSongs(albumDetails, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi);
        if (pathname.includes('top-tracks')) {
            const idType = time_range === 'short_term' ? 'short_term' : time_range === 'medium_term' ? 'medium_term' : 'long_term';
            const modifyTopTracks = {
                // modify top Tracks data structure to fit playlist data structure so as to use the same function
                id: idType,
                type: 'top-tracks',
                tracks: { items: topTracks.map(track => ({ track })) }
            }
            // console.log(modifyTopTracks)
            startPlayingListOfSongs(modifyTopTracks, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi);
        }


    }
    useEffect(() => {
        // activate gsap anination on first render
        headerNavAnimations(color, gsapTrigger, gsapScroller);
    }, [color, playlist, gsapTrigger, gsapScroller]);

    useEffect(() => {
        // set the current name of body of work on header nav (e.g "playlist", "Top tracks", "album")

        const topTrackidType = time_range === 'short_term' ? 'short_term' : time_range === 'medium_term' ? 'medium_term' : 'long_term';
        const topTrackNameType = time_range === 'short_term' ? '4 Weeks' : time_range === 'medium_term' ? '6 Months' : 'All Time';

        if (pathname.includes('playlist')) setHeaderListOfSongsDetails({ name: playlist?.name, id: playlist?.id })
        if (pathname.includes('top-tracks')) setHeaderListOfSongsDetails({ name: `Top Tracks ${topTrackNameType}`, id: topTrackidType })
        if (pathname.includes('album')) setHeaderListOfSongsDetails({ name: albumDetails?.name, id: albumDetails?.id })
    }, [pathname, setHeaderListOfSongsDetails, playlist, topTracks, time_range, albumDetails])

    return (
        <header className='relative z-10'>
            <div className={`HEADER-NAV fixed p-3 flex items-center w-[100%]`}>
                <div className="NAV-ICONS flex items-center  flex-1 ">
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black'>
                        <ChevronLeftIcon onClick={() => history.back()} className='h-6 w-6' />
                    </span>
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black ml-4'>
                        <ChevronRightIcon onClick={() => history.forward()} className='h-6 w-6' />
                    </span>
                    <div className={`HEADER-NAV-ICON opacity-0 ${gsapTrigger === '.TOP-ARTISTS' && 'hidden'}`}>
                        {
                            (isPlaying && headerListOfSongsDetails?.id === parentId) ?
                                <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className={` h-[4rem] w-[4rem] ml-4 mr-4 text-[#1ED760] cursor-pointer  hidden md:block`} />
                                :
                                <PlayIcon
                                    onClick={handlePlay}
                                    className=' h-[4rem] w-[4rem] ml-4 mr-4 text-[#1ED760] cursor-pointer  hidden  md:block'
                                />
                        }
                    </div>

                    <h1 className='HEADER-NAV-H1 text-[1.1rem] hidden opacity-0 md:block'>{headerListOfSongsDetails?.name}</h1>
                </div>
                <div
                    onClick={signOut}
                    className='flex items-center h-fit bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 md:mr-[15em]'>
                    <img
                        className='rounded-full w-7 h-7'
                        src={session?.user?.image}
                        alt="User Avatar" />
                    <h2 className='text-sm'>{session?.user?.name}</h2>
                    <ChevronDownIcon className='h-4 w-4' />
                </div>
                <div className='text-white md:hidden'>
                    {
                        isSidebarOpen ?
                            <XCircleIcon onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)} className='h-7 w-7' />
                            :
                            <MenuIcon onClick={() => sidebarAnimation('OPEN', setIsSidebarOpen)} className='h-7 w-77' />
                    }

                </div>
            </div>

        </header>
    )
}

export default HeaderNav
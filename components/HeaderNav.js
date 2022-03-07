/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useSession, signOut } from 'next-auth/react'
import { headerNavAnimations, sidebarAnimation } from '../lib/gsapAnimation'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState } from '../globalState/playlistsAtom';
import { MenuIcon, PauseIcon, PlayIcon, XCircleIcon } from '@heroicons/react/solid';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import { handlePlayAndPauseOfPlayer, startPlayingPlaylist } from '../utils';
import useSpotify from '../customHooks/useSpotify';
import { isSidebarOpenState } from '../globalState/sidebarAtom'
import { useRouter } from 'next/router';
function HeaderNav({ color, gsapTrigger, gsapScroller }) {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const playlist = useRecoilValue(playlistState) // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [{ parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState); // Atom global state
    const { pathname } = useRouter()
    const handlePlay = () => {
        if (pathname.includes('playlist')) {
            startPlayingPlaylist(playlist, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi)
        } else if (pathname.includes('top-tracks')) {

        } else if (pathname.includes('album')) {

        }
    }
    useEffect(() => {
        // activate gsap anination on first render
        headerNavAnimations(color, gsapTrigger, gsapScroller);
    }, [color, playlist, gsapTrigger, gsapScroller])

    return (
        <header className='relative'>
            <div className={`HEADER-NAV fixed p-3 flex items-center w-[100%]`}>
                <div className="NAV-ICONS flex items-center  flex-1 ">
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black'>
                        <ChevronLeftIcon className='h-6 w-6' />
                    </span>
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black ml-4'>
                        <ChevronRightIcon className='h-6 w-6' />
                    </span>
                    {
                        (isPlaying && playlist?.id === parentId) ?
                            <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className={`HEADER-NAV-ICON h-[4rem] w-[4rem] ml-4 mr-4 text-[#1ED760] cursor-pointer  hidden opacity-0 md:block`} />
                            :
                            <PlayIcon
                                onClick={handlePlay}
                                className='HEADER-NAV-ICON h-[4rem] w-[4rem] ml-4 mr-4 text-[#1ED760] cursor-pointer  hidden opacity-0 md:block'
                            />
                    }
                    <h1 className='HEADER-NAV-H1 text-[1.1rem] hidden opacity-0 md:block'>{playlist?.name}</h1>
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
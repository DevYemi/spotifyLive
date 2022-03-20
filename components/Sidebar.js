import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { HomeIcon, SearchIcon, RssIcon, VolumeUpIcon } from '@heroicons/react/outline'
import { BellIcon, PauseIcon, PlusIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import useSpotify from '../customHooks/useSpotify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isNewPlaylistCreatedState, userPlaylistsState } from '../globalState/playlistsAtom'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import { createNewPlaylist, handlePlayAndPauseOfPlayer } from '../utils';
import { isSidebarOpenState } from '../globalState/sidebarAtom';
import { sidebarAnimation } from '../lib/gsapAnimation';
import { useRouter } from 'next/router';
import { popMssgTypeState } from '../globalState/popMessageAtom';
import Button from '@mui/material/Button';
import { isModalOpenState } from '../globalState/displayModalAtom';

function Sidebar() {
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const [isNewPlaylistCreated, setIsNewPlaylistCreated] = useRecoilState(isNewPlaylistCreatedState); // Atom global state
    const { data: session } = useSession(); // get the current logged in user session
    const [playlists, setPlaylists] = useRecoilState(userPlaylistsState); // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const { parentId } = useRecoilValue(currentTrackIdState); // Atom global state
    const popMssgType = useRecoilValue(popMssgTypeState) // Atom global state
    const setIsSidebarOpen = useSetRecoilState(isSidebarOpenState); // Atom global state
    const setIsModalOpen = useSetRecoilState(isModalOpenState); //Atom global state
    const router = useRouter();

    const handleCreatePlaylistClick = () => {
        setIsNewPlaylistCreated(true);
        sidebarAnimation('CLOSE', setIsSidebarOpen);
        createNewPlaylist([], router, playlists, setIsModalOpen, spotifyApi);
    }
    useEffect(() => {
        // gets user playlist from spotify on first render

        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists()
                .then(data => {
                    setPlaylists(data?.body?.items);
                })
                .catch(err => {
                    console.log(err)
                    setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message })
                })

        }

    }, [session, isNewPlaylistCreated, spotifyApi, popMssgType, setPlaylists, setIsModalOpen])

    return (
        <div className='SIDEBAR text-gray-500 text-xs border-r z-10 border-gray-900 h-[90vh] absolute left-[-745px] md:max-w-[13rem] lg:max-w-[15rem] lg:text-sm flex-col md:flex md:static md:!pt-0 '>
            <section className='NAV-SECTION space-y-2 p-5 '>
                <Link href='/'>
                    <a
                        onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen) }}
                        className='spotifyLogo block w-[40%] md:w-[65%]'>
                        <Image
                            src={'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png'}
                            width={'100%'}
                            height={'100%'}
                            className='LOGO'
                            layout='responsive'
                            objectFit='contain'
                            alt='Spotify Logo'
                        />
                    </a>
                </Link>
                <Button>
                    <Link href={'/'}>
                        <a onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen) }} className='flex text-gray-500 items-center space-x-2 hover:text-white text-[13px]'>
                            <HomeIcon className='h-7 w-7' />
                            <p>Home</p>
                        </a>
                    </Link>
                </Button>

                <Button className='block'>
                    <Link href='/search'>
                        <a
                            onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen) }}
                            className='flex text-gray-500 items-center space-x-2 hover:text-white text-[13px]'>
                            <SearchIcon className='h-7 w-7' />
                            <p>Search</p>
                        </a>
                    </Link>
                </Button>


                <hr className='border-t-[0.1px] border-gray-900 ' />
                <Button
                    onClick={handleCreatePlaylistClick}
                    className='flex text-gray-500 items-center space-x-2 hover:text-white text-[13px]'>
                    <span className='p-1 rounded-sm bg-gray-300'>
                        <PlusIcon className='h-4 w-4 text-gray-900 ' />
                    </span>
                    <p>Create PLaylist</p>
                </Button>
                <Button>
                    <Link href='/new-release'>
                        <a
                            onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen) }}
                            className='flex text-gray-500 items-center space-x-2 hover:text-white text-[13px]'>
                            <span className='p-1 rounded-sm bg-gradient-to-br from-[#280887] to-[#6B8278] '>
                                <BellIcon className='h-4 w-4 text-white' />
                            </span>
                            <p>New Release</p>
                        </a>
                    </Link>
                </Button>


                <Button className='flex items-center text-gray-500 space-x-2 hover:text-white text-[13px]'>
                    <span className='p-1 rounded-sm bg-[#004638] '>
                        <RssIcon className='h-4 w-4 text-[#159643]' />
                    </span>
                    <p>Your episodes</p>
                </Button>
                <hr className='border-t-[0.1px] border-gray-900 ' />
            </section>
            {/* PLAYLIST */}
            <section className="PLAYLIST-SECTION pl-5 pb-5 space-y-1 scrollbar-style h-[191px] overflow-y-scroll flex-1">
                {
                    playlists?.map((playlist, i) => (

                        <Button
                            key={`${playlist?.id} ${i}`}
                            className="flex justify-between w-full items-center text-[12px] text-gray-500 ">
                            <Link href={`/playlist/${playlist?.id}`}>
                                <a onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen); }}
                                    className="cursor-pointer text-left truncate hover:text-white flex-[1] ">
                                    {playlist?.name}
                                </a>
                            </Link>
                            {(isPlaying && parentId === playlist?.id) &&
                                <div className='group'>
                                    <VolumeUpIcon className=' h-4 w-4 group-hover:hidden text-[#1ED760] ' />
                                    <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying, setIsModalOpen)} className='h-4 w-4 hidden text-white group-hover:block' />
                                </div>
                            }
                        </Button>





                    ))
                }
            </section>



        </div>
    )
}

export default Sidebar
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { HomeIcon, SearchIcon, LibraryIcon, RssIcon } from '@heroicons/react/outline'
import { BellIcon, HeartIcon, PauseIcon, PlusIcon, VolumeUpIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import useSpotify from '../customHooks/useSpotify'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, userPlaylistsState } from '../globalState/playlistsAtom'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import { createNewPlaylist, handlePlayAndPauseOfPlayer } from '../utils';
import { isSidebarOpenState } from '../globalState/sidebarAtom';
import { sidebarAnimation } from '../lib/gsapAnimation';
import { useRouter } from 'next/router';
import DisplayModal from './appModals/DisplayModal'

function Sidebar() {
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const { data: session } = useSession(); // get the current logged in user session
    const [playlists, setPlaylists] = useRecoilState(userPlaylistsState); // keeps state for all the user playists gotten from spotify
    const [, setPlaylistId] = useRecoilState(playlistsIdState); // Atom globla state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const { parentId } = useRecoilValue(currentTrackIdState); // Atom global state
    const [, setIsSidebarOpen] = useRecoilState(isSidebarOpenState); // Atom global state
    const router = useRouter();

    useEffect(() => {
        // gets user playlist from spotify on first render
        const getUserPlaylists = async () => {

            if (spotifyApi.getAccessToken()) {
                const data = await spotifyApi.getUserPlaylists().catch(err => console.log(err))
                setPlaylists(data?.body?.items);
            }

        }
        getUserPlaylists();

    }, [session, spotifyApi, setPlaylists])

    return (
        <div className='SIDEBAR text-gray-500 text-xs border-r z-10 border-gray-900 h-[90vh] absolute left-[-745px] md:max-w-[13rem] lg:max-w-[15rem] lg:text-sm flex-col md:flex md:static md:!pt-0 '>
            <section className='NAV-SECTION space-y-4 p-5 '>
                <Link href='/'>
                    <a
                        onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)}
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
                <Link href={'/'}>
                    <a onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)} className='flex items-center space-x-2 hover:text-white text-[14px]'>
                        <HomeIcon className='h-7 w-7' />
                        <p>Home</p>
                    </a>
                </Link>

                <Link href='/search'>
                    <a
                        onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)}
                        className='flex items-center space-x-2 hover:text-white text-[14px]'>
                        <SearchIcon className='h-7 w-7' />
                        <p>Search</p>
                    </a>
                </Link>

                <hr className='border-t-[0.1px] border-gray-900 ' />
                <button
                    onClick={() => { sidebarAnimation('CLOSE', setIsSidebarOpen); createNewPlaylist([], router, playlists, spotifyApi); }}
                    className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <span className='p-1 rounded-sm bg-gray-300'>
                        <PlusIcon className='h-4 w-4 text-gray-900 ' />
                    </span>
                    <p>Create PLaylist</p>
                </button>
                <Link href='/new-release'>
                    <a
                        onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)}
                        className='flex items-center space-x-2 hover:text-white text-[14px]'>
                        <span className='p-1 rounded-sm bg-gradient-to-br from-[#280887] to-[#6B8278] '>
                            <BellIcon className='h-4 w-4 text-white' />
                        </span>
                        <p>New Release</p>
                    </a>
                </Link>

                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <span className='p-1 rounded-sm bg-[#004638] '>
                        <RssIcon className='h-4 w-4 text-[#159643]' />
                    </span>
                    <p>Your episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900 ' />
            </section>
            {/* PLAYLIST */}
            <section className="PLAYLIST-SECTION pl-5 pr-2 pb-5 space-y-4 scrollbar-style h-[191px] overflow-y-scroll flex-1">
                {
                    playlists?.map((playlist, i) => (
                        <Link key={`${playlist?.id} ${i}`} href={`/playlist/${playlist?.id}`}>
                            <a
                                onClick={() => sidebarAnimation('CLOSE', setIsSidebarOpen)}
                                className="flex justify-between items-center">
                                <p
                                    onClick={() => setPlaylistId(playlist?.id)}
                                    className="cursor-pointer hover:text-white ">
                                    {playlist?.name}
                                </p>
                                {(isPlaying && parentId === playlist?.id) &&
                                    <div className='group'>
                                        <VolumeUpIcon className=' h-3 w-3 group-hover:hidden ' />
                                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='h-4 w-4 hidden group-hover:block' />
                                    </div>
                                }
                            </a>
                        </Link>


                    ))
                }
            </section>

            <DisplayModal />

        </div>
    )
}

export default Sidebar
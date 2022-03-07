import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { HomeIcon, SearchIcon, LibraryIcon, RssIcon } from '@heroicons/react/outline'
import { HeartIcon, PauseIcon, PlusIcon, VolumeUpIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import useSpotify from '../customHooks/useSpotify'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState } from '../globalState/playlistsAtom'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import { handlePlayAndPauseOfPlayer } from '../utils';

function Sidebar() {
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const { data: session } = useSession(); // get the current logged in user session
    const [playlists, setPlaylists] = useState([]); // keeps state for all the user playists gotten from spotify
    const [{ }, setPlaylistId] = useRecoilState(playlistsIdState); // Atom globla state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const { parentId } = useRecoilValue(currentTrackIdState); // Atom global state

    useEffect(() => {
        // gets user playlist from spotify on first render
        const getUserPlaylists = async () => {

            if (spotifyApi.getAccessToken()) {
                const data = await spotifyApi.getUserPlaylists().catch(err => console.log(err))
                setPlaylists(data?.body?.items);
            }

        }
        getUserPlaylists();

    }, [session, spotifyApi])

    return (
        <div className='text-gray-500 text-xs border-r border-gray-900 h-[90vh] hidden sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm md:flex flex-col'>
            <section className='NAV-SECTION space-y-4 p-5 '>
                <Link href='/'>
                    <a className='spotifyLogo block w-[65%]'>
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
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <HomeIcon className='h-7 w-7' />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <SearchIcon className='h-7 w-7' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <LibraryIcon className='h-7 w-7' />
                    <p>Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900 ' />
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <span className='p-1 rounded-sm bg-gray-300'>
                        <PlusIcon className='h-4 w-4 text-gray-900 ' />
                    </span>
                    <p>Create PLaylist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <span className='p-1 rounded-sm bg-gradient-to-br from-[#280887] to-[#6B8278] '>
                        <HeartIcon className='h-4 w-4 text-white' />
                    </span>
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white text-[14px]'>
                    <span className='p-1 rounded-sm bg-[#004638] '>
                        <RssIcon className='h-4 w-4 text-[#159643]' />
                    </span>
                    <p>Your episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900 ' />
            </section>
            {/* PLAYLIST */}
            <section className="PLAYLIST-SECTION pl-5 pr-2 pb-5 space-y-4 scrollbar-style mt-5 h-[37%] overflow-y-scroll flex-1">
                {
                    playlists?.map(playlist => (
                        <Link key={playlist?.id} href={`/playlist/${playlist?.id}`}>
                            <a className="flex justify-between items-center">
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



        </div>
    )
}

export default Sidebar
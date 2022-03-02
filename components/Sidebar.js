import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { HomeIcon, SearchIcon, LibraryIcon, RssIcon } from '@heroicons/react/outline'
import { HeartIcon, PlusIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import useSpotify from '../customHooks/useSpotify'
import { useRecoilState } from 'recoil';
import { playlistsIdState } from '../globalState/playlistsAtom'

function Sidebar() {
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const { data: session } = useSession(); // get the current logged in user session
    const [playlists, setPlaylists] = useState([]); // keeps state for all the user playists gotten from spotify
    const [playlistId, setPlaylistId] = useRecoilState(playlistsIdState); // keeps ID state of the current clicked playlist by user

    useEffect(() => {
        // gets user playlist from spotify on first render
        const getUserPlaylists = async () => {
            try {
                if (spotifyApi.getAccessToken()) {
                    const data = await spotifyApi.getUserPlaylists();
                    setPlaylists(data.body.items);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUserPlaylists();

    }, [session, spotifyApi])
    return (
        <div className='text-gray-500 p-5 text-xs border-r border-gray-900 h-[90vh] hidden sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm md:flex flex-col'>
            <section className='NAV-SECTION space-y-4 '>
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
            <section className="PLAYLIST-SECTION space-y-4 scrollbar-style mt-5 h-[37%] overflow-y-scroll flex-1">
                {
                    playlists.map(playlist => (
                        <p key={playlist.id}
                            onClick={() => setPlaylistId(playlist.id)}
                            className="cursor-pointer hover:text-white ">
                            {playlist.name}
                        </p>
                    ))
                }
            </section>



        </div>
    )
}

export default Sidebar
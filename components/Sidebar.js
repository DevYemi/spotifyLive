import React, { useEffect, useState } from 'react'
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from './../hooks/useSpotify'
import { useRecoilState } from 'recoil';
import { playlistsIdState } from '../globalState/playlistsAtom'

function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistsIdState);

    useEffect(async () => {
        try {
            if (spotifyApi.getAccessToken()) {
                const data = await spotifyApi.getUserPlaylists();
                setPlaylists(data.body.items);
            }
        } catch (error) {
            console.log(error);
        }

    }, [session, spotifyApi])
    return (
        <div className='text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide hidden sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm md:inline-flex '>
            <div className='space-y-4'>
                <button onClick={() => signOut()} className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='h-5 w-5' />
                    <p>Log Out</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='h-5 w-5' />
                    <p>home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchIcon className='h-5 w-5' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryIcon className='h-5 w-5' />
                    <p>Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900 ' />
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5' />
                    <p>Create PLaylist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='h-5 w-5' />
                    <p>Your episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900 ' />

                {/* PLAYLIST */}
                {
                    playlists.map(playlist => (
                        <p key={playlist.id}
                            onClick={() => setPlaylistId(playlist.id)}
                            className="cursor-pointer hover:text-white ">
                            {playlist.name}
                        </p>
                    ))
                }


            </div>
        </div>
    )
}

export default Sidebar
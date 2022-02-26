import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline';
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, playlistState } from '../globalState/playlistsAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from '../components/Songs'

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-orange-500",
]

function Center({ playlistDetailsServer }) {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistsIdState);
    const [playlistDetails, setPlaylistDetails] = useRecoilState(playlistState);
    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId]);


    useEffect(async () => {
        try {
            if (spotifyApi.getAccessToken()) {
                const data = await spotifyApi.getPlaylist(playlistId);
                setPlaylistDetails(data.body);
            }

        } catch (error) {
            console.log(error);
        }

    }, [spotifyApi, playlistId, session]);

    return (
        <div className='flex-grow text-white'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
                    <img
                        className='rounded-full w-10 h-10'
                        src={session?.user?.image}
                        alt="User Avatar" />
                    <h2>{session?.user?.name}</h2>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img
                    className='h-44 w-44 shadow-2xl'
                    src={playlistDetails?.images[0]?.url}
                    alt="playlist-image" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className='text-2xl md:text-1xl xl:text-5xl font-bold'>{playlistDetails?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
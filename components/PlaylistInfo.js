/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, playlistState } from '../globalState/playlistsAtom';
import useSpotify from '../customHooks/useSpotify';
import Songs from './Songs'
import HeaderNav from './HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../lib/time';

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

function PlaylistInfo() {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify(); // custom hooks that gets the spotify web api
    const [color, setColor] = useState(null); // keeps state of the current color that was selected after shuffle
    const playlistId = useRecoilValue(playlistsIdState); // Atom global state
    const [playlistDetails, setPlaylistDetails] = useRecoilState(playlistState); // Atom global state

    useEffect(() => {
        // shuffle colors array and select one
        setColor(shuffle(colors).pop())
    }, [playlistId]);


    useEffect(() => {
        // gets user specific playlist from spotify
        const getUserPlaylist = async () => {

            if (spotifyApi.getAccessToken()) {
                const data = await spotifyApi.getPlaylist(playlistId).catch(err => console.log(err))
                setPlaylistDetails(data?.body);
            }

        }

        getUserPlaylist();


    }, [spotifyApi, playlistId, session, setPlaylistDetails]);
    return (
        <div className='PLAYLIST flex-grow scrollbar-style text-white overflow-scroll h-[100vh]'>
            <HeaderNav color={color} />
            <section className={`PLAYLIST-SECTION-1 flex flex-col items-center space-x-7 bg-gradient-to-b ${color} to-black  text-white p-8 md:flex-row md:items-end md:h-80`}>
                <img
                    className='h-44 w-44 shadow-2xl'
                    src={playlistDetails?.images[0]?.url}
                    alt="playlist-image" />
                <div className='mt-4 md:mt-0'>
                    <p className='text-[.7rem]'>PLAYLIST</p>
                    <h1 className='text-1xl md:text-5xl xl:text-6xl font-bold'>{playlistDetails?.name}</h1>
                    <p className='text-sm mt-4 text-gray-400'>{playlistDetails?.description}</p>
                    <span className='text-sm font-light hover:underline '>
                        <Link href="/">
                            <a>{playlistDetails?.owner?.display_name}</a>
                        </Link>
                    </span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light'>{playlistDetails?.followers?.total} Likes</span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light '>{playlistDetails?.tracks?.total} songs,</span>
                    <span className='text-xs font-light ml-1 text-gray-300 '>{calBodyOfWorkDuration(playlistDetails)}</span>


                </div>
            </section>
            <section className='PLAYLIST-SECTION-2' >
                <Songs />
            </section>
        </div>
    )
}

export default PlaylistInfo
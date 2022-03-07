/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { getSession, useSession } from 'next-auth/react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistsIdState, playlistState } from '../../globalState/playlistsAtom';
import Songs from '../../components/Songs'
import HeaderNav from '../../components/HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../../lib/time';
import { useRouter } from 'next/router';
import spotifyApi from '../../lib/spotify';

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

function PlaylistInfo({ playlist }) {
    const { data: session } = useSession();  // get the current logged in user session
    const [color, setColor] = useState(null); // keeps state of the current color that was selected after shuffle
    const playlistId = useRecoilValue(playlistsIdState); // Atom global state
    const [, setPlaylist] = useRecoilState(playlistState); // Atom global state

    useEffect(() => {
        // shuffle colors array and select one
        setColor(shuffle(colors).pop())
    }, [playlistId]);

    useEffect(() => {
        // Scroll to the top on every first render
        const playlistInfo = document.querySelector(".PLAYLIST");
        if (playlistInfo) {
            playlistInfo.scrollTo(0, 0);
        }
    }, [playlistId])
    useEffect(() => {
        // set playlist details to global state on first render
        setPlaylist(playlist);
    }, [playlistId, session, setPlaylist, playlist]);
    return (
        <div className='PLAYLIST flex-grow scrollbar-style text-white overflow-scroll h-[100vh]'>
            <HeaderNav color={color} gsapTrigger={'.PLAYLIST-SECTION-1'} gsapScroller={'.PLAYLIST'} />
            <section className={`PLAYLIST-SECTION-1 flex flex-col items-center space-x-7 bg-gradient-to-b ${color} to-black  text-white p-8 md:flex-row md:items-end md:h-80`}>
                <img
                    className='h-44 w-44 shadow-2xl'
                    src={playlist?.images[0]?.url}
                    alt="playlist-image" />
                <div className='mt-4 md:mt-0'>
                    <p className='text-[.7rem]'>PLAYLIST</p>
                    <h1 className='text-1xl md:text-5xl xl:text-6xl font-bold'>{playlist?.name}</h1>
                    <p className='text-sm mt-4 text-gray-400'>{playlist?.description}</p>
                    <span className='text-sm font-light hover:underline '>
                        <Link href="/">
                            <a>{playlist?.owner?.display_name}</a>
                        </Link>
                    </span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light'>{playlist?.followers?.total} Likes</span>
                    <span className='text-2xl mr-1 ml-1 '>.</span>
                    <span className='text-sm font-light '>{playlist?.tracks?.total} songs,</span>
                    <span className='text-xs font-light ml-1 text-gray-300 '>{calBodyOfWorkDuration(playlist)}</span>


                </div>
            </section>
            <section className='PLAYLIST-SECTION-2' >
                <Songs />
            </section>
        </div>
    )
}

export default PlaylistInfo

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context); // get session
        const { params: { playlistId } } = context; // get query Id
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api
        var data = await spotifyApi.getPlaylist(playlistId).catch(err => console.log(err)) // get data from spotify api    
    } catch (err) {
        console.log(err)
    }

    return {
        props: {
            playlist: data?.body
        }
    }
}


/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import HeaderNav from './HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../lib/time'
import { shuffle } from 'lodash';
import useSpotify from '../customHooks/useSpotify';
import { DotsHorizontalIcon, HeartIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline'
import { handlePlayAndPauseOfPlayer, startPlayingListOfSongs } from '../utils';
import { useRecoilState } from 'recoil';
import { isPlayingState } from '../globalState/songAtom';

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

function Album({ albumDetails }) {
    console.log('album');
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [color, setColor] = useState(null); // keeps state of the current color that was selected after shuffle
    const [albumOwnerDetails, setAlbumOwnerDetails] = useState(null); // keeps state of the details of the owner album
    const [isUserFollowingAlbum, setIsUserFollowingAlbum] = useState(false); // keeps state if a user is following a Album
    const spotifyApi = useSpotify();
    console.log(albumOwnerDetails);

    useEffect(() => {
        // get the album owner dertails on first render 
        spotifyApi.getArtist(albumDetails?.artists[0]?.id)
            .then(data => {
                setAlbumOwnerDetails(data.body)
                console.log('Artist information', data.body);
            }).catch(err => console.log(err))
        setColor(shuffle(colors).pop())
    }, [spotifyApi, albumDetails]);
    return (
        <div
            className='ALBUM flex-grow scrollbar-style pb-[1em] text-white overflow-scroll h-[90vh]'>
            <HeaderNav color={'red'} gsapTrigger={'.ALBUM-SECTION-1'} gsapScroller={'.ALBUM '} />
            <section className={`ALBUM-SECTION-1 flex flex-col items-center space-x-7 bg-gradient-to-b ${color} to-black  text-white p-8 md:flex-row md:items-end md:h-80`}>
                <div
                    className=' group relative shadow-2xl flex justify-center items-center h-[179px] w-[179px] bg-[#282828] cursor-pointer '>
                    <img
                        className='h-full object-cover'
                        src={albumDetails?.images[0]?.url}
                        alt='' />
                </div>

                <div className='mt-4 md:mt-0'>
                    <p className='text-[.8rem] font-semibold'>{albumDetails?.album_type.toUpperCase()}</p>
                    <div>
                        <h1 className='text-1xl md:text-5xl xl:text-6xl font-bold'>{albumDetails?.name}</h1>
                    </div>
                    <div className='flex items-center space-x-1'>
                        <span className='h-6 w-6 rounded-full inline-block'>
                            {albumOwnerDetails &&
                                <img src={albumOwnerDetails?.images[0]?.url} alt="" className='rounded-full' />
                            }

                        </span>
                        <span className='text-sm font-light hover:underline '>
                            <Link href="/">
                                <a>{albumDetails?.artists[0]?.name}</a>
                            </Link>
                        </span>
                        <span className='text-[40px] translate-y-[-12px] mr-1 ml-1 '>.</span>
                        <span className='text-sm font-light'>{albumDetails?.release_date.slice(0, 4)}</span>
                        <span className='text-[40px] translate-y-[-12px] mr-1 ml-1'>.</span>
                        <span className='text-sm font-light '>{albumDetails?.tracks?.total} songs,</span>
                        <span className='text-xs font-light ml-1 text-gray-300 '>{calBodyOfWorkDuration(albumDetails, 'album')}</span>
                    </div>



                </div>
            </section>

            <section className='ALBUM-SECTION-2 flex px-6 items-center space-x-5 mb-5'>
                {
                    (isPlaying) ?
                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                        :
                        <PlayIcon onClick={() => startPlayingListOfSongs()} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                }
                {
                    <>
                        {
                            isUserFollowingAlbum ?
                                <HeartIcon className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                                :
                                <HeartIconOutline className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                        }


                    </>

                }

                <DotsHorizontalIcon className='h-6 w-6 text-gray-500 cursor-pointer' />

            </section>
        </div>
    )
}

export default Album
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime, getCorrectDate } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { PlayIcon } from '@heroicons/react/solid';
import Link from 'next/link';

function Song({ order, track, addedAt }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(track.id);
        setIsPlaying(true);
        console.log(track.uri)
        try {
            spotifyApi.play({
                uris: [track.uri]
            })
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className='group grid grid-cols-2 text-gray-500 py-4  hover:bg-gray-900 rounded-lg px-5'>
            <div className='flex items-center space-x-4'>
                <p className='group-hover:hidden'>{order + 1}</p>
                <p onClick={playSong}><PlayIcon className='w-5 h-5 hidden group-hover:block' /></p>
                <img
                    className='h-10 w-10'
                    src={track?.album?.images[0]?.url}
                    alt="Track Picture" />
                <div>
                    <p className='w-36 lg:w-64 truncate text-white text-sm'>{track?.name}</p>
                    <p className=' text-sm w-[100%] max-w-[100px] truncate md:max-w-[150px] lg:max-w-[250px]'>{
                        track?.artists.map((artist, i) => (
                            <Link key={artist?.id} href={'/'}>
                                <a className='hover:underline cursor-pointer w-max inline'>{`${artist?.name} ${track?.artists.length > (i + 1) ? "," : ""}`}</a>
                            </Link>
                        ))
                    }</p>
                </div>
            </div>

            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='w-40 hidden text-[13px] md:inline'>{track?.album?.name}</p>
                <p className='hidden text-[13px] lg:inline'>{getCorrectDate(addedAt)}</p>
                <p className='text-sm'>{convertMsToTime(track?.duration_ms, true)}</p>
            </div>

        </div>
    )
}

export default Song
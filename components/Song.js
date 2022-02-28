/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from '../customHooks/useSpotify'
import { convertMsToTime } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'

function Song({ order, track }) {
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
        <div
            onClick={playSong}
            className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 cursor-pointer rounded-lg'>
            <div className='flex items-center space-x-4'>
                <p>{order + 1}</p>
                <img
                    className='h-10 w-10'
                    src={track.album?.images[0]?.url}
                    alt="Track Picture" />
                <div>
                    <p className='w-36 lg:w-64 truncate text-white'>{track.name}</p>
                    <p className='w-48'>{track.artists[0].name}</p>
                </div>
            </div>

            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='w-40 hidden md:inline'>{track.album.name}</p>
                <p>{convertMsToTime(track.duration_ms)}</p>
            </div>

        </div>
    )
}

export default Song
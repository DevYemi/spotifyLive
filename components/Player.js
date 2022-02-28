/* eslint-disable @next/next/no-img-element */
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import useSpotify from '../customHooks/useSpotify'
import useSongInfo from '../customHooks/useSongInfo'
import { debounce } from "lodash"
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';

function Player() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();

    const handlePlayAndPause = async () => {
        const data = await spotifyApi.getMyCurrentPlaybackState();
        if (data.body.is_playing) {
            spotifyApi.pause();
            setIsPlaying(false);
        } else {
            spotifyApi.play();
            setIsPlaying(true);
        }
    }
    const debouncedAdjustVolume = useCallback((volume) => {
        const debouncedReturnedFromLodash = debounce((volume) => {
            spotifyApi.setVolume(volume);
        }, 500);
        debouncedReturnedFromLodash(volume);
    }, [spotifyApi])
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume, debouncedAdjustVolume])
    useEffect(() => {
        const fetchCurrentSong = async () => {
            if (!songInfo) {
                const data = await spotifyApi.getMyCurrentPlayingTrack();
                console.log(`NOW PLAYING ${data.body?.item}`);
                setCurrentTrackId(data.body?.item?.id);


                const { body } = await spotifyApi.getMyCurrentPlaybackState();
                setIsPlaying(body?.is_playing);
            }
        }
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session, setCurrentTrackId, setIsPlaying, songInfo])

    return (
        <div className='text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            {/* LEFT */}
            <div className='flex items-center space-x-4'>
                <img
                    className='hidden md:inline h-10 w-10'
                    src={songInfo?.album.images[0].url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* CENTER */}
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon className='button hover:scale-125' />
                <RewindIcon
                    onClick={spotifyApi.skipToPrevious}
                    className='button hover:scale-125' />

                {
                    isPlaying ? (
                        <PauseIcon onClick={handlePlayAndPause} className='button hover:scale-125 w-10 h-10' />
                    ) : (
                        <PlayIcon onClick={handlePlayAndPause} className='button hover:scale-125 w-10 h-10' />
                    )
                }
                <FastForwardIcon
                    onClick={spotifyApi.skipToNext}
                    className='button hover:scale-125' />
            </div>

            {/* RIGHT */}
            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeOffIcon
                    onClick={(e) => setVolume(1)}
                    className='button hover:scale-125' />
                <input
                    className='w-14 md:w-28'
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    type="range"
                    min={0}
                    max={100} />
                <VolumeUpIcon
                    onClick={() => volume < 2 ? setVolume(50) : setVolume(volume)}
                    className='button hover:scale-125' />
            </div>
        </div>
    )
}

export default Player
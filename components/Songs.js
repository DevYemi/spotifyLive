import { ClockIcon, DotsHorizontalIcon, HeartIcon, PlayIcon, PauseIcon } from '@heroicons/react/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { playlistState } from '../globalState/playlistsAtom'
import { handlePlayAndPauseOfPlayer, startPlayingPlaylist, toggleFollowingPlaylist } from '../utils'
import Song from './Song'
import useSpotify from '../customHooks/useSpotify'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { useSession } from 'next-auth/react'

function Songs() {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const playlist = useRecoilValue(playlistState);  // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [{ parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isUserFollowingPlaylist, setIsUserFollowingPlaylist] = useState(false); // keeps state if a user is following a playlist

    useEffect(() => {
        // checks if a user is following playlist
        if (session && playlist) {

            spotifyApi.areFollowingPlaylist(session?.user?.username, playlist?.id, [`${session?.user?.username}`])
                .then(function (data) {
                    setIsUserFollowingPlaylist(data?.body[0])
                }).catch((err) => console.log(err))

        }


    }, [spotifyApi, playlist, session])

    return (
        <div className=''>
            <div className='flex px-6 items-center space-x-5 mb-5'>
                {
                    (isPlaying && playlist?.id === parentId) ?
                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                        :
                        <PlayIcon onClick={() => startPlayingPlaylist(playlist, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                }
                {
                    playlist?.owner?.id !== session?.user?.username &&
                    <>
                        {
                            isUserFollowingPlaylist ?
                                <HeartIcon onClick={() => toggleFollowingPlaylist("UN-FOL", playlist, setIsUserFollowingPlaylist, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                                :
                                <HeartIconOutline onClick={() => toggleFollowingPlaylist("FOL", playlist, setIsUserFollowingPlaylist, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                        }


                    </>

                }

                <DotsHorizontalIcon className='h-6 w-6 text-gray-500 cursor-pointer' />
            </div>

            <div className='px-8 flex flex-col space-y-1 pb-28'>
                <div className='grid px-5 uppercase text-sm font-bold grid-cols-2 text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                    <p className=''># Title</p>

                    <div className='flex items-center justify-between ml-auto md:ml-0'>
                        <p className='w-40 hidden md:inline'>Album</p>
                        <p className='hidden lg:inline'>Date Added</p>
                        <p className=''><ClockIcon className='h-5 w-5' /></p>
                    </div>
                </div>
                {
                    playlist?.tracks.items.map(({ track, added_at }, i) => (
                        <Song
                            key={track?.id}
                            track={track}
                            addedAt={added_at}
                            order={i}
                        />
                    ))
                }
            </div>

        </div>
    )
}

export default Songs
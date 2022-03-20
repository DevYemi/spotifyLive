import { ClockIcon, DotsHorizontalIcon, HeartIcon, PlayIcon, PauseIcon } from '@heroicons/react/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { playlistState } from '../globalState/playlistsAtom'
import { handlePlayAndPauseOfPlayer, startPlayingListOfSongs, toggleFollowingPlaylist } from '../utils'
import Song from './Song'
import useSpotify from '../customHooks/useSpotify'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { useSession } from 'next-auth/react'
import useSongInfo from '../customHooks/useSongInfo'
import { popMssgTypeState } from '../globalState/popMessageAtom'
import Button from '@mui/material/Button';
import { isModalOpenState } from '../globalState/displayModalAtom'

function Songs() {
    // console.log('SONGS');
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song
    const playlist = useRecoilValue(playlistState);  // Atom global state
    const setIsModalOpen = useSetRecoilState(isModalOpenState); //Atom global state
    const setPopMssgType = useSetRecoilState(popMssgTypeState) // Atom global state
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [{ parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [isUserFollowingPlaylist, setIsUserFollowingPlaylist] = useState(false); // keeps state if a user is following a playlist

    useEffect(() => {
        // checks if a user is following playlist
        if (session && playlist?.id) {

            spotifyApi.areFollowingPlaylist(session?.user?.username, playlist?.id, [`${session?.user?.username}`])
                .then(data => {
                    setIsUserFollowingPlaylist(data?.body[0])
                }).catch((err) => {
                    console.log(err);
                    setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message })
                })

        }


    }, [spotifyApi, playlist, session, setIsModalOpen])

    return (
        <div className=''>
            <div className='flex px-6 items-center mb-5'>
                {
                    (isPlaying && playlist?.id === parentId) ?
                        <Button><PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying, setIsModalOpen)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' /></Button>
                        :
                        <Button><PlayIcon onClick={() => startPlayingListOfSongs(playlist, 0, setCurrentTrackId, setIsPlaying, parentId, setIsModalOpen, spotifyApi)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' /></Button>
                }
                {
                    playlist?.owner?.id !== session?.user?.username &&
                    <>
                        {
                            isUserFollowingPlaylist ?
                                <Button><HeartIcon onClick={() => toggleFollowingPlaylist("UN-FOL", playlist, setIsUserFollowingPlaylist, setPopMssgType, setIsModalOpen, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' /></Button>
                                :
                                <Button><HeartIconOutline onClick={() => toggleFollowingPlaylist("FOL", playlist, setIsUserFollowingPlaylist, setPopMssgType, setIsModalOpen, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' /></Button>
                        }


                    </>

                }

                <Button><DotsHorizontalIcon className='h-6 w-6 text-gray-500 cursor-pointer' /></Button>
            </div>

            <div className='px-5 flex flex-col space-y-1 md:px-8'>
                <div className='grid px-5 uppercase text-sm font-bold grid-cols-2 text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                    <p className=''># Title</p>

                    <div className='flex items-center justify-between ml-auto md:ml-0'>
                        <p className='w-40 hidden md:inline'>Album</p>
                        <p className='hidden lg:inline'>Date Added</p>
                        <p className=''><ClockIcon className='h-5 w-5' /></p>
                    </div>
                </div>
                {
                    playlist?.tracks?.items?.map(({ track, added_at }, i) => (
                        <Song
                            key={`${track?.id} ${i}`}
                            track={track}
                            addedAt={added_at}
                            songInfo={songInfo}
                            isPlaying={isPlaying}
                            parentId={parentId}
                            order={i}
                            type={'playlist'}
                        />
                    ))
                }
            </div>

        </div>
    )
}

export default Songs
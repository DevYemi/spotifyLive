import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import useSpotify from './useSpotify'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentPlayingTrackFromSpotify } from '../utils';
import { isModalOpenState } from '../globalState/displayModalAtom';

// A custom hook returns the value of the current song that is being played at the moment on the app
function useSongInfo() {
    const spotifyApi = useSpotify();
    const [{ currentTrackId, parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const setIsPlaying = useSetRecoilState(isPlayingState); // Atom global state
    const setIsModalOpen = useSetRecoilState(isModalOpenState); //Atom global state
    const [songInfo, setSongInfo] = useState();

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (!spotifyApi.getAccessToken()) return
            const trackInfo = await getCurrentPlayingTrackFromSpotify(spotifyApi, setIsModalOpen)

            setSongInfo(trackInfo);
            // console.log(trackInfo)
            setCurrentTrackId({ currentTrackId: trackInfo?.id, parentId: parentId ? parentId : null });


            spotifyApi.getMyCurrentPlaybackState()
                .then((data) => {
                    setIsPlaying(data?.body?.is_playing);
                })
                .catch(err => {
                    console.log(err);
                    setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message });
                });


        }

        fetchSongInfo();
    }, [currentTrackId, spotifyApi, setCurrentTrackId, setIsPlaying, parentId, setIsModalOpen])
    return songInfo
}

export default useSongInfo
import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from './useSpotify'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentPlayingTrackFromSpotify } from '../utils';

// A custom hook returns the value of the current song that is being played at the moment on the app
function useSongInfo() {
    const spotifyApi = useSpotify();
    const [{ currentTrackId, parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [songInfo, setSongInfo] = useState();

    useEffect(() => {
        const fetchSongInfo = async () => {
            const trackInfo = await getCurrentPlayingTrackFromSpotify(spotifyApi)

            setSongInfo(trackInfo);

            setCurrentTrackId({ currentTrackId: trackInfo?.id, parentId: parentId ? parentId : null });


            const { body } = await spotifyApi.getMyCurrentPlaybackState().catch(err => console.log(err));
            setIsPlaying(body?.is_playing);

        }

        fetchSongInfo();
    }, [currentTrackId, spotifyApi, setCurrentTrackId, setIsPlaying, parentId])
    return songInfo
}

export default useSongInfo
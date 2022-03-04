import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from './useSpotify'
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom'
import { useState } from 'react';
import { useEffect } from 'react';

// A custom hook returns the value of the current song that is being played at the moment on the app
function useSongInfo() {
    const spotifyApi = useSpotify();
    const [{ currentTrackId }, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const [songInfo, setSongInfo] = useState();

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                // get the current song playing if there is one in the currentTrackId global state
                const res = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    { headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` } }
                )

                const trackInfo = await res.json();
                setSongInfo(trackInfo);

                const { body } = await spotifyApi.getMyCurrentPlaybackState().catch(err => console.log(err));
                setIsPlaying(body?.is_playing);
            } else {
                // gets the current playing song from spotify if there isnt one in the currentTrackId global state
                const data = await spotifyApi.getMyCurrentPlayingTrack().catch(err => console.log(err));
                const res = await fetch(
                    `https://api.spotify.com/v1/tracks/${data.body?.item?.id}`,
                    { headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` } }
                )

                const trackInfo = await res.json();
                setSongInfo(trackInfo);

                setCurrentTrackId({ currentTrackId: data.body?.item?.id, parentId: null });


                const { body } = await spotifyApi.getMyCurrentPlaybackState().catch(err => console.log(err));
                setIsPlaying(body?.is_playing);
            }
        }

        fetchSongInfo();
    }, [currentTrackId, spotifyApi, setCurrentTrackId, setIsPlaying])
    return songInfo
}

export default useSongInfo
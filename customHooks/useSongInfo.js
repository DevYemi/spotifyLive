import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from './useSpotify'
import { currentTrackIdState } from '../globalState/songAtom'
import { useState } from 'react';
import { useEffect } from 'react';

function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState();

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                const res = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    { headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` } }
                )

                const trackInfo = await res.json();
                setSongInfo(trackInfo);
            }
        }

        fetchSongInfo();
    }, [currentTrackId, useSpotify])
    return songInfo
}

export default useSongInfo
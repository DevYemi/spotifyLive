export const playSong = (track, setCurrentTrackId, setIsPlaying, playlistId, spotifyApi) => {
    // starts playing a song when its clicked on
    spotifyApi.play({
        uris: [track.uri]
    }).then(() => {
        setCurrentTrackId({ currentTrackId: track.id, parentId: playlistId });
        setIsPlaying(true);
    }).catch(err => console.log(err));

}

export const startPlayingPlaylist = async (playlist, index, setCurrentTrackId, setIsPlaying, parentId, spotifyApi) => {
    // starts playing a playlist from the first active song when the user click on PLAY or Resume if there currently playing one
    console.log(playlist)
    const playlistSongs = playlist?.tracks?.items // gets all the songs on the playlist
    const track = playlistSongs[index]?.track; // gets a specific song based on the index passed

    const data = await spotifyApi.getMyCurrentPlaybackState().catch(err => console.log(err)); // get from spotify the current playback state

    if (!data?.body?.is_playing && playlist?.id === parentId) {
        // if there is a currentTrack paused and its a Track of the current displayed playlist, resume the song from where it stopped

        handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying);
    }
    else if (playlistSongs.length > index) {
        // else start playlist from the first song thats available

        spotifyApi.play({
            // play the song
            uris: [track.uri]
        }).then(() => {
            // update state
            setCurrentTrackId({ currentTrackId: track.id, parentId: playlist?.id });
            setIsPlaying(true);
        }).catch(err => {
            // if it fails to play song, move to the next song on playlist list
            console.log(err);
            startPlayingPlaylist(playlist, index + 1, setCurrentTrackId, setIsPlaying, parentId, spotifyApi);
        });
    }

}

export const handlePlayAndPauseOfPlayer = async (spotifyApi, setIsPlaying) => {
    // handle pause and play event in the music player
    const data = await spotifyApi.getMyCurrentPlaybackState().catch(err => console.log(err));
    if (data?.body?.is_playing) {
        spotifyApi.pause().catch(err => console.log(err));
        setIsPlaying(false);
    } else {
        spotifyApi.play().catch(err => console.log(err));
        setIsPlaying(true);
    }

}

export const toggleTrackRepeat = (isTrackOnRepeat, setIsTrackOnRepeat, spotifyApi) => {
    // Toggle the a track repeat state, turns it off or on based on its current state
    const op = isTrackOnRepeat ? "off" : "track"
    spotifyApi.setRepeat(op)
        .then(() => setIsTrackOnRepeat(!isTrackOnRepeat))
        .catch(err => console.log(err))
}

export const handleTrackSkips = (op, setCurrentTrackId, spotifyApi) => {
    // handles the skips forward and backward functionality of tracks
    if (op === "NEXT") {
        spotifyApi.skipToNext("lol")
            .then(async () => {
                const trackInfo = await getCurrentPlayingTrackFromSpotify(spotifyApi);
                setCurrentTrackId({ currentTrackId: trackInfo?.id, parentId: null })
            })
            .catch((err) => console.log(err))
    } else if (op === "PREV") {
        spotifyApi.skipToPrevious("lol")
            .then(async () => {
                const trackInfo = await getCurrentPlayingTrackFromSpotify(spotifyApi);
                setCurrentTrackId({ currentTrackId: trackInfo?.id, parentId: null })
            })
            .catch((err) => console.log(err))
    }
}

export const getCurrentPlayingTrackFromSpotify = async (spotifyApi) => {
    // gets the track thats currently playing from spotify
    const data = await spotifyApi.getMyCurrentPlayingTrack().catch(err => console.log(err));
    const res = await fetch(
        `https://api.spotify.com/v1/tracks/${data?.body?.item?.id}`,
        { headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` } }
    )

    return await res.json();
}

export const toggleFollowingPlaylist = (op, playlist, setIsUserFollowingPlaylist, spotifyApi) => {
    // Toggle user playlist following state 
    if (op === "FOL") {
        // Follow a playlist
        spotifyApi.followPlaylist(playlist?.id, { 'public': false })
            .then(function (data) {
                setIsUserFollowingPlaylist(true)
            }).catch(err => console.log(err))
    } else if (op === "UN-FOL") {
        // Unfollow a playlist
        spotifyApi.unfollowPlaylist(playlist?.id)
            .then(function (data) {
                setIsUserFollowingPlaylist(false);
            }).catch(err => console.log(err))
    }

}
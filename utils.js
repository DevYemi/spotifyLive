export const playSong = async (track, setCurrentTrackId, setIsPlaying, listOfSongsId, parentId, spotifyApi) => {
    // starts playing a song when its clicked on
    const data = await spotifyApi?.getMyCurrentPlaybackState().catch(err => console.log(err)); // get from spotify the current playback state

    if (!data?.body?.is_playing && listOfSongsId === parentId) {
        // if there is a currentTrack paused and its a Track of the current displayed listOfSongs, resume the song from where it stopped
        return handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying);
    }
    spotifyApi.play({
        uris: [track.uri]
    }).then(() => {
        setCurrentTrackId({ currentTrackId: track.id, parentId: listOfSongsId });
        setIsPlaying(true);
    }).catch(err => console.log(err));

}

export const startPlayingListOfSongs = async (listOfSongs, index, setCurrentTrackId, setIsPlaying, parentId, spotifyApi) => {
    // starts playing a listOfSongs from the first active song when the user click on PLAY or Resume if there currently playing one
    const listOfSongsSongs = listOfSongs?.tracks?.items // gets all the songs on the listOfSongs
    const track = listOfSongs?.type === 'playlist' ? listOfSongsSongs[index]?.track : listOfSongsSongs[index]  // gets a specific song based on the index passed

    const data = await spotifyApi?.getMyCurrentPlaybackState().catch(err => console.log(err)); // get from spotify the current playback state

    if (!data?.body?.is_playing && listOfSongs?.id === parentId) {
        // if there is a currentTrack paused and its a Track of the current displayed listOfSongs, resume the song from where it stopped

        handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying);
    }
    else if (listOfSongsSongs?.length > index) {
        // else start listOfSongs from the first song thats available

        spotifyApi.play({
            // play the song
            uris: [track.uri]
        }).then(() => {
            // update state
            setCurrentTrackId({ currentTrackId: track.id, parentId: listOfSongs?.id });
            setIsPlaying(true);
        }).catch(err => {
            // if it fails to play song, move to the next song on listOfSongs list
            console.log(err);
            startPlayingListOfSongs(listOfSongs, index + 1, setCurrentTrackId, setIsPlaying, parentId, spotifyApi);
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
    try {
        const data = await spotifyApi.getMyCurrentPlayingTrack().catch(err => console.log(err));
        if (!spotifyApi.getAccessToken() || !data?.body?.item?.id) return
        const res = await fetch(
            `https://api.spotify.com/v1/tracks/${data?.body?.item?.id}`,
            { headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` } }
        )

        return await res.json();
    } catch (err) {
        console.log(err)
    }

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
export const toggleSavedAlbum = (op, album, setIsAlbumSaved, spotifyApi) => {
    // Toggle user saved album 
    if (op === "SAVE") {
        // Save an album to user libary
        spotifyApi.addToMySavedAlbums([album?.id])
            .then(() => {
                setIsAlbumSaved(true);
            }).catch(err => console.log(err))
    } else if (op === "UN-SAVE") {
        // Unsave an album from a user libary
        spotifyApi.removeFromMySavedAlbums([album?.id])
            .then(() => {
                setIsAlbumSaved(false);
            }).catch(err => console.log(err))
    }

}

export const toggleSavedTrack = (op, track, setIsTrackSaved, spotifyApi) => {
    // Toggle user saved track 
    if (op === "SAVE") {
        // Save an track to user libary
        spotifyApi.containsMySavedTracks([track?.id])
            .then(() => {
                console.log('SAVE')
                setIsTrackSaved(true);
            }).catch(err => console.log(err))
    } else if (op === "UN-SAVE") {
        // Unsave an track from a user libary
        spotifyApi.removeFromMySavedTracks([track?.id])
            .then(() => {
                console.log('UN-SAVE');
                setIsTrackSaved(false);
            }).catch(err => console.log(err))
    }

}

export const createNewPlaylist = (selectedTracks, router, userPlaylists, spotifyApi) => {
    // Create a new Playlist for user

    const selectedTracksURIs = selectedTracks.map(track => track?.uri)
    let newCreatedPlaylistId = ''
    spotifyApi.createPlaylist(`My playlist #${userPlaylists.length + 1}`, { 'description': 'My description', 'public': true })
        .then((data) => {
            // first create playlist
            newCreatedPlaylistId = data?.body?.id
            if (selectedTracks.length < 1) return router.push(`/playlist/${newCreatedPlaylistId}`)

            spotifyApi.addTracksToPlaylist(newCreatedPlaylistId, selectedTracksURIs)
                .then(function (data) {
                    // then add the tracks selceted
                    router.push(`/playlist/${newCreatedPlaylistId}`)
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

export const removeTrackFromPlaylist = (position, playlist, router, spotifyApi) => {
    // Remove tracks from a playlist at a specific position
    console.log(playlist, position, spotifyApi)
    spotifyApi.removeTracksFromPlaylistByPosition(playlist?.id, [position], playlist?.snapshot_id)
        .then(function (data) {
            router.push(router.asPath)
            console.log(data);
            console.log('Tracks removed from playlist!');
        }).catch(err => console.log(err))
}

export const hasScrollReachedBottom = (e, searchInput, foundTracks, divClass, debounceduserSearchInput) => {
    // checks if the user has scroll to the bottom of the page while searching for tracks and gets new data
    if (searchInput.current.value === '') return
    if (!foundTracks?.items || foundTracks?.items?.length < 1) return
    // console.log(searchInput, foundTracks, divClass, debounceduserSearchInput)
    const playlistDiv = document.querySelector(divClass)
    const height = playlistDiv.offsetHeight;
    const scrollTop = playlistDiv.scrollTop;
    const scrollHeight = playlistDiv.scrollHeight;
    let reachedBottom = scrollTop + height >= (scrollHeight + 17) || scrollTop + height === scrollHeight
    if (reachedBottom) debounceduserSearchInput.current(e.target.value, 'next', foundTracks)
}

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { getSession } from 'next-auth/react'
import spotifyApi from '../../lib/spotify';
import PlaylistInfo from '../../components/Playlist';



function PlaylistInfoScreen({ playlist }) {

    return <PlaylistInfo playlist={playlist} />
}

export default PlaylistInfoScreen

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context); // get session
        const { params: { playlistId } } = context; // get query Id
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api
        var data = await spotifyApi.getPlaylist(playlistId).catch(err => console.log(err)) // get data from spotify api    
    } catch (err) {
        console.log(err)
    }

    return {
        props: {
            playlist: data?.body
        }
    }
}


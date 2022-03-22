/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { getSession } from 'next-auth/react'
import spotifyApi from '../../lib/spotify';
import PlaylistInfo from '../../components/Playlist';
import NotFound from '../404'




function PlaylistInfoScreen({ playlist }) {

    return <PlaylistInfo playlist={playlist} />

}

export default PlaylistInfoScreen

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context); // get session
        if (!session) return { redirect: { destination: '/login', permanent: false, } } // Redirect to login page if there is no user
        const { params: { playlistId } } = context; // get query Id
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api
        var data = await spotifyApi.getPlaylist(playlistId).catch(err => console.log(err)) // get data from spotify api
        if (!data?.body) return { notFound: true } // if data doesnt exist throw a 404 page
    } catch (err) {
        console.log(err)
    }

    return {
        props: {
            playlist: data?.body ? data?.body : null
        }
    }
}



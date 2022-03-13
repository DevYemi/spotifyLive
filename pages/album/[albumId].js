import React from 'react'
import spotifyApi from "../../lib/spotify";
import { getSession } from "next-auth/react";
import Album from '../../components/Album';

function AlbumScreen({ albumDetails }) {
    return (
        <Album albumDetails={albumDetails} />
    )
}

export default AlbumScreen

export async function getServerSideProps(context) {
    try {
        const { params: { albumId } } = context

        const session = await getSession(context); // get session
        spotifyApi.setAccessToken(session?.user?.accessToken); // set accessToken to spotify api 
        var data = await spotifyApi.getAlbum(albumId).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
    return {
        props: {
            albumDetails: data?.body ? data?.body : null
        }
    }
}
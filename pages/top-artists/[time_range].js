import React from 'react'
import spotifyApi from "../../lib/spotify";
import { getSession } from "next-auth/react";
import TopArtists from '../../components/TopArtists'

function TopArtistsScreen({ topArtists }) {
    console.log(topArtists)
    return <TopArtists topArtists={topArtists} />
}

export default TopArtistsScreen

export async function getServerSideProps(context) {
    try {
        const { params: { time_range } } = context

        const session = await getSession(context); // get session
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api 
        var data = await spotifyApi.getMyTopArtists({ time_range, limit: 50 }).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
    return {
        props: {
            topArtists: data?.body?.items
        }
    }
}

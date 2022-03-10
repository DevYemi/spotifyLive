import React, { useEffect } from 'react'
import spotifyApi from "../../lib/spotify";
import { getSession } from "next-auth/react";
import TopTracks from '../../components/TopTracks';


function TopTracksScreen({ topTracks }) {
    return <TopTracks topTracks={topTracks} />
}

export default TopTracksScreen

export async function getServerSideProps(context) {
    try {
        const { params: { time_range } } = context

        const session = await getSession(context); // get session
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api 
        var data = await spotifyApi.getMyTopTracks({ time_range, limit: 50 }).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
    return {
        props: {
            topTracks: data?.body?.items
        }
    }
}
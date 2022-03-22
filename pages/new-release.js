import React from 'react'
import spotifyApi from "../lib/spotify";
import { getSession } from "next-auth/react";
import NewRelease from '../components/NewRelease';

function NewReleaseScreen({ newRelease }) {

    return (
        <NewRelease newRelease={newRelease} />
    )
}

export default NewReleaseScreen

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context); // get session
        if (!session) return { redirect: { destination: '/login', permanent: false, } } // Redirect to login page if there is no user
        spotifyApi.setAccessToken(session.user.accessToken); // set accessToken to spotify api 
        var data = await spotifyApi.getNewReleases({ limit: 50, offset: 0, country: 'NG' }).catch(err => console.log(err));

    } catch (err) {
        console.log(err)
    }
    return {
        props: {
            newRelease: data?.body ? data?.body : null
        }
    }
}
import React from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react';
import spotifyApi from '../lib/spotify'


function useSpotify() {
    const { data: session } = useSession();
    useEffect(() => {
        //Redirect User to login page if refresh token attempt failed
        if (session && session.error === "RefreshAccessTokenError") {
            return signIn();
        } else if (session) {
            spotifyApi.setAccessToken(session.user.accessToken)
        }

    }, [session])
    return spotifyApi
}

export default useSpotify
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"


async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log(`Refresh token at refreshAccessToken`)
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // 1 hour as 3600 returns from spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.log(error, "From refreshAccessToken");
        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}
export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    jwt: {
        secret: process.env.JWT_SECRET,
        encryption: true,
        signingKey: '{"kty":"oct","kid":"<the-kid>","alg":"HS512","k":"<the-key>"}',
        encryptionKey: '{"kty":"oct","kid":"<the-kid>","alg":"A256GCM","k":"<the-key>"}',
    },
    session: {
        jwt: true,
    },
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // initial sign in, user is sigining in for the first time
            if (account && user) {
                console.log("TOKEN AT INITIAL LOGIN")
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000 // we are handling expiry times in milliseconds hence * 1000
                }
            }

            // Return previous token if access token has not expire yet
            if (Date.now() < token.accessTokenExpires) {
                console.log("TOKEN IS STILL VALID")
                return token
            }

            // Access token has expired, so we need to refrsh it....
            console.log("ACCESS TOKEN HAS EXPIRED REFRSHING");
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            console.log(`Refresh token at session`)
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session
        }
    }
})
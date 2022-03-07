import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"


async function refreshAccessToken(token) {
    try {
        // add accessToken and refreshToken to the spotifyApi
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        // refresh token and get a new one
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        // return new refreshed token
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
        // encryption needed to create JWT web token
        secret: process.env.JWT_SECRET,
        encryption: true,
        signingKey: '{"kty":"oct","kid":"<the-kid>","alg":"HS512","k":"<the-key>"}',
        encryptionKey: '{"kty":"oct","kid":"<the-kid>","alg":"A256GCM","k":"<the-key>"}',
    },
    secret: process.env.JWT_SECRET,
    pages: {
        // custom login page given to nextAuth instead of the default one
        signIn: '/login'
    },
    callbacks: {

        async jwt({ token, account, user }) {

            // gets called each time useSession or getSession is used on the client side of the code
            if (account && user) {
                // initial sign in, user is sigining in for the first time
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000 // we are handling expiry times in milliseconds hence * 1000
                }
            }


            if (Date.now() < token.accessTokenExpires) {
                // Return previous token if access token has not expire yet    
                return token
            }

            // Access token has expired, so we need to refrsh it....
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            // gets called each time jwt callback has been called
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session
        }
    }
})
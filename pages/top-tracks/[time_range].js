import React, { useEffect } from 'react'
import spotifyApi from "../../lib/spotify";
import HeaderNav from '../../components/HeaderNav'
import { getSession } from "next-auth/react";
import Song from '../../components/Song';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { playlistState } from '../../globalState/playlistsAtom';

function TopTracks({ topTracks }) {
    const [, setPlaylistTopTracks] = useRecoilState(playlistState) // Atom global state
    const router = useRouter();
    const timeRangeType = router?.query?.time_range

    return (
        <div className='TOP-TRACKS-WR text-white flex-1 overflow-y-scroll scrollbar-style'>
            <HeaderNav color={"red"} gsapScroller={'.TOP-TRACKS-WR'} gsapTrigger={'.TOP-TRACKS'} />
            <div className='TOP-TRACKS mt-[5em]'>
                <h1 className='text-[4rem] text-center md:text-[3rem]'>Your Top Tracks</h1>
                <div className='w-fit mx-auto my-[2em]'>
                    <Link href={'/top-tracks/short_term'}>
                        <a className={`${timeRangeType === "short_term" ? 'timeRangeActive' : ""}`}>
                            4 WEEKS
                        </a>
                    </Link>
                    <Link href={'/top-tracks/medium_term'}>
                        <a className={`mx-[1em] ${timeRangeType === 'medium_term' ? 'timeRangeActive' : ""} md:mx-[3em]`}>
                            6 MONTHS
                        </a>
                    </Link>
                    <Link href={'/top-tracks/long_term'}>
                        <a className={`${timeRangeType === "long_term" ? 'timeRangeActive' : ""}`}>
                            ALL TIME
                        </a>
                    </Link>
                </div>
                {
                    topTracks.map((track, i) => (
                        <Song
                            key={track?.id}
                            track={track}
                            addedAt={false}
                            order={i}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default TopTracks

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
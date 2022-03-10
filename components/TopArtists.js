import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import HeaderNav from './HeaderNav'

function TopArtists({ topArtists }) {
    const router = useRouter();
    const timeRangeType = router?.query?.time_range
    console.log(topArtists)
    return (
        <div className='TOP-ARTISTS-WR text-white flex-1 overflow-y-scroll scrollbar-style h-[88vh]'>
            <HeaderNav color={"red"} gsapScroller={'.TOP-ARTISTS-WR'} gsapTrigger={'.TOP-ARTISTS'} />
            <div className='TOP-ARTISTS mt-[5em]'>
                <h1 className='text-[4rem] text-center md:text-[3rem]'>Your Top Artists</h1>
                <div className='w-fit mx-auto my-[2em] mb-8'>
                    <Link href={'/top-artists/short_term'}>
                        <a className={`${timeRangeType === "short_term" ? 'timeRangeActive' : ""}`}>
                            4 WEEKS
                        </a>
                    </Link>
                    <Link href={'/top-artists/medium_term'}>
                        <a className={`mx-[1em] ${timeRangeType === 'medium_term' ? 'timeRangeActive' : ""} md:mx-[3em]`}>
                            6 MONTHS
                        </a>
                    </Link>
                    <Link href={'/top-artists/long_term'}>
                        <a className={`${timeRangeType === "long_term" ? 'timeRangeActive' : ""}`}>
                            ALL TIME
                        </a>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-center max-w-7xl mx-auto ">
                    {
                        topArtists.map((artist, i) => (
                            <div key={artist?.id} className='w-full max-w-[200px] px-5 py-5 rounded-md cursor-pointer hover:bg-[#383737]'>

                                <Image
                                    src={artist?.images[0]?.url ? artist?.images[0]?.url : '/img/not-found.jpg'}
                                    width={'100%'}
                                    className='rounded-sm'
                                    height={'100%'}
                                    layout='responsive'
                                    objectFit='contain'
                                    alt={`${artist?.name} Image`}
                                />

                                <p className='mt-5 text-sm '>{`${i + 1}) ${artist?.name}`}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TopArtists
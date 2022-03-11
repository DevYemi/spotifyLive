import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import HeaderNav from './HeaderNav'

function NewRelease({ newRelease }) {

    return (
        <div
            className='NEW-RELEASE-WR text-white flex-1 overflow-y-scroll pb-[1em] scrollbar-style h-[90vh]'>
            <HeaderNav color={"red"} gsapScroller={'.NEW-RELEASE-WR'} gsapTrigger={'.NEW-RELEASE'} />
            <div className='NEW-RELEASE px-4 md:px-8 mt-[5em] md:max-w-[1440px] mx-auto'>
                <h1 className='text-[3rem] text-center md:text-[3rem]'>Newly Release Jams</h1>
                <div className='flex flex-wrap justify-center '>
                    {newRelease?.albums?.items.length > 0 && newRelease?.albums?.items.map(track => (
                        <Link key={track?.id} href={`/checkout/${track?.id}`}>
                            <a className='group relative bg-[#181818] w-fit p-3 rounded-lg mx-1 space-y-2 mb-4 md:p-4 hover:bg-[#292828]'>
                                <span className=' absolute p-1 bg-[#129b42] top-2 left-2 text-[6px]  rounded-sm font-light z-[2] md:text-[9px]'>
                                    {track?.total_tracks > 1 ? 'Album' : 'Single'}
                                </span>
                                <div className='w-14 h-14 md:w-28 md:h-28'>
                                    <Image
                                        src={track?.images[0]?.url}
                                        width={'100%'}
                                        height={'100%'}
                                        className='!rounded-xl'
                                        layout='responsive'
                                        objectFit='contain'
                                        alt=''
                                    />
                                </div>
                                <p className='font-bold text-[9px] max-w-[50px] md:max-w-[100px] md:text-sm w-fit'>{track?.name}</p>
                                <p className='text-[#636161] text-[9px] w-fit md:text-sm'>{track?.artists[0]?.name}</p>
                            </a>
                        </Link>

                    ))

                    }

                </div>
            </div>
        </div>
    )
}

export default NewRelease
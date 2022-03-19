import React from 'react'
import HeaderNav from './common/HeaderNav'
import MusicCard from './common/MusicCard'

function NewRelease({ newRelease }) {
    // console.log('NR');
    return (
        <div
            className='NEW-RELEASE-WR text-white flex-1 overflow-y-scroll pb-[1em] scrollbar-style h-[90vh]'>
            <HeaderNav color={"red"} gsapScroller={'.NEW-RELEASE-WR'} gsapTrigger={'.NEW-RELEASE'} />
            <div className='NEW-RELEASE px-4 md:px-8 mt-[5em] md:max-w-[1440px] mx-auto'>
                <h1 className='text-[3rem] text-center md:text-[3rem]'>Newly Release Jams</h1>
                <div className='flex flex-wrap justify-center '>
                    {newRelease?.albums?.items.length > 0 && newRelease?.albums?.items.map((track, i) => (
                        <MusicCard
                            key={`${track?.id} ${i}`}
                            track={track}
                            type={'NR'}
                        />

                    ))

                    }

                </div>
            </div>
        </div>
    )
}

export default NewRelease
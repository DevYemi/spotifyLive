/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import HeaderNav from '../components/HeaderNav'
import Loading from '../components/Loading'
import SearchBox from '../components/SearchBox'
import { hasScrollReachedBottom } from '../utils'


function SearchScreen() {
    const [searchLoading, setSearchLoading] = useState(false) // keeps loading state
    const [foundTracks, setFoundTracks] = useState({}); // keeps state of the found Tracks
    const searchDiv = useRef() // search Div for new tracks
    const searchInput = useRef() // search Input for new tracks
    let debounceduserSearchInput = useRef() // keeps debounce function for TracksearchInput

    useEffect(() => {
        // reset this values on first render
        setFoundTracks({})
        if (searchInput.current) searchInput.current.value = ''
    }, []);
    return (
        <div
            onScroll={(e) => hasScrollReachedBottom(e, searchInput, foundTracks, '.SEARCH-WR', debounceduserSearchInput)}
            className='SEARCH-WR text-white flex-1 overflow-y-scroll pb-[1em] scrollbar-style h-[90vh]'>
            <HeaderNav color={"red"} gsapScroller={'.SEARCH-WR'} gsapTrigger={'.SEARCH'} />
            <div ref={searchDiv} className='SEARCH px-8 mt-[5em]'>
                <h1 className='text-[3rem] text-center md:text-[4rem]'>Search For Any Song</h1>
                <SearchBox
                    foundTracks={foundTracks}
                    searchInput={searchInput}
                    setSearchLoading={setSearchLoading}
                    setFoundTracks={setFoundTracks}
                    parentClass={'.SEARCH'}
                    debounceduserSearchInput={debounceduserSearchInput}
                />
                {
                    foundTracks?.items?.length > 0 &&
                    <div className='max-w-[1220px] mx-auto'>
                        {foundTracks?.items.map(track => (

                            <div key={track?.id}
                                className='flex justify-between items-center my-5 md:px-8 '>
                                <img
                                    className='h-10 w-10 rounded-sm'
                                    src={track?.album?.images[0].url}
                                    alt='' />
                                <p className='text-[10px] font-light max-w-[40%] md:text-sm'>{track?.name}</p>
                                <Link href={`/album/${track?.album?.id}`}>
                                    <a className='border border-[#ffffff] text-[#706f6f] py-2 px-2 rounded-3xl text-[10px] md:px-4 md:text-sm'>
                                        Check Out
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </div>


                }
                {
                    searchLoading &&
                    <Loading
                        size={90}
                        type={'Rings'}
                        color={"#282828"}
                        style={"flex justify-center"}
                    />
                }


            </div>
        </div>
    )
}

export default SearchScreen
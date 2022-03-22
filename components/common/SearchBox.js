import { SearchIcon, XIcon } from '@heroicons/react/solid'
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import useSpotify from '../../customHooks/useSpotify';
import Button from '@mui/material/Button';

function SearchBox({ parentClass, foundTracks, searchInput, setSearchLoading, setFoundTracks, debounceduserSearchInput }) {
    const { data: session } = useSession();  // get the current logged in user session
    const spotifyApi = useSpotify();
    const handleXIconClick = () => {
        if (parentClass === '.PLAYLIST-SECTION-3') document.querySelector(parentClass).style.display = 'none'
        if (parentClass === '.SEARCH') {
            setFoundTracks({});
            setSearchLoading(false);
            searchInput.current.value = '';
        }
    }
    useEffect(() => {
        // On First Render get a debounce function and set it
        debounceduserSearchInput.current = debounce(async (userSearchInput, searchType, prevSearch) => {
            if (userSearchInput === '') return setFoundTracks({})
            setSearchLoading(true)
            if (searchType === 'initial') {
                spotifyApi.searchTracks(userSearchInput, { limit: 50 })
                    .then(function (data) {
                        setFoundTracks(data?.body?.tracks)
                        setSearchLoading(false)
                    }).catch(err => {
                        console.log(err);
                        setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message })
                    })
            } else if (searchType === 'next') {
                if (!prevSearch?.next) return
                try {
                    const data = await fetch(prevSearch.next,
                        {
                            headers: {
                                Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    )
                    const nextSearch = await data.json();
                    setFoundTracks({
                        ...prevSearch,
                        items: [...prevSearch?.items, ...nextSearch?.tracks?.items],
                        next: nextSearch?.tracks?.next,
                        previous: nextSearch?.tracks?.previous,
                        href: nextSearch?.tracks?.href
                    });
                    setSearchLoading(false)
                } catch (err) {
                    setSearchLoading(false)
                    console.log(err)
                }

            }


        }, 1000);
    }, [spotifyApi, session, debounceduserSearchInput, setSearchLoading, setFoundTracks])
    return (
        <div className='flex justify-between items-center'>
            <div className=' max-w-[200px] md:min-w-[350px]'>
                <p>Lets Find Something For Your Playlist</p>
                <div className='mt-5 relative'>
                    <input
                        ref={searchInput}
                        onChange={(e) => debounceduserSearchInput.current(e.target.value, 'initial', foundTracks)}
                        className='w-full py-2 pl-8 pr-1 rounded-md bg-[#2D2D2D] outline-none border-0 '
                        placeholder='Search for songs or episodes'
                        type="text" />
                    <SearchIcon className='w-5 h-5 absolute text-[#6a6767] top-[11px] left-[5px] ' />
                </div>
            </div>
            <Button className='!text-white'>
                <XIcon
                    onClick={handleXIconClick}
                    className='h-6 w-6 cursor-pointer md:h-10 md:w-10' />
            </Button>

        </div>
    )
}

export default SearchBox
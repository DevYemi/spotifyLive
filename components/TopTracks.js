import React, { useEffect } from 'react'
import HeaderNav from './common/HeaderNav'
import Song from './Song';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isNewPlaylistCreatedState, playlistState, userPlaylistsState } from '../globalState/playlistsAtom';
import { ClipboardListIcon, ClockIcon } from '@heroicons/react/solid'
import { topTrackIsCreatePlaylistState, topTrackSelectedState, topTracksState } from '../globalState/topTracksAtom';
import { createNewPlaylist } from '../utils';
import useSpotify from '../customHooks/useSpotify';
import useSongInfo from '../customHooks/useSongInfo';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import Button from '@mui/material/Button';
import { isModalOpenState } from '../globalState/displayModalAtom';


function TopTracks({ topTracks }) {
    // console.log('TOP-TRACKS');
    const spotifyApi = useSpotify(); // custom hooks
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song
    const setTopTracks = useSetRecoilState(topTracksState) // Atom global state
    const isPlaying = useRecoilValue(isPlayingState); // Atom global state
    const { parentId } = useRecoilValue(currentTrackIdState); // Atom global state
    const setIsNewPlaylistCreated = useSetRecoilState(isNewPlaylistCreatedState); // Atom global state
    const setIsModalOpen = useSetRecoilState(isModalOpenState); //Atom global state
    const [topTrackIsCreatePlaylist, setTopTrackIsCreatePlaylist] = useRecoilState(topTrackIsCreatePlaylistState); // keeps state if a user clicked on the create playlist icon
    const [selectedTracks, setSelectedTracks] = useRecoilState(topTrackSelectedState); // keeps state of all the selected playlist by the user
    const userPlaylists = useRecoilValue(userPlaylistsState); // Atom Global State 
    const router = useRouter();
    const timeRangeType = router?.query?.time_range


    const handleCreatePlaylistClick = async () => {
        setSelectedTracks([]);
        setIsNewPlaylistCreated(true);
        setTopTrackIsCreatePlaylist(false);
        createNewPlaylist(selectedTracks, router, userPlaylists, setIsModalOpen, spotifyApi);
    }
    useEffect(() => {
        // set Top Tracks Lists to global state
        setTopTracks(topTracks)
    }, [topTracks, setTopTracks]);



    return (
        <div className='TOP-TRACKS-WR text-white flex-1 overflow-y-scroll scrollbar-style'>
            <HeaderNav color={"red"} gsapScroller={'.TOP-TRACKS-WR'} gsapTrigger={'.TOP-TRACKS'} />
            <div className='TOP-TRACKS relative mt-[5em]'>
                <h1 className='text-[4rem] text-center md:text-[3rem]'>Your Top Tracks</h1>
                <div className='w-fit mx-auto my-[2em] mb-8'>
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
                <Button
                    onClick={() => { setTopTrackIsCreatePlaylist(!topTrackIsCreatePlaylist); }}
                    className='!flex !items-center !justify-center !mx-auto !my-10 !w-fit !py-3 !px-2 !rounded-md !bg-[#111827] !cursor-pointer hover:!bg-[#1e2636]'
                >
                    <ClipboardListIcon className='h-5 w-5 text-gray-300' />
                    <p className='ml-3 text-sm text-gray-300'>{topTrackIsCreatePlaylist ? 'Cancel' : 'Create a Playlist From Your Favourite Tracks'}</p>

                </Button>

                <div className='px-8 flex flex-col space-y-1'>
                    <div className='grid px-5 uppercase text-sm font-bold grid-cols-2 text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                        <p className=''># Title</p>

                        <div className='flex items-center justify-between ml-auto md:ml-0'>
                            <p className='w-40 hidden md:inline'>Album</p>
                            <p className=''><ClockIcon className='h-5 w-5' /></p>
                        </div>
                    </div>
                    {
                        topTracks?.length > 0 &&
                        topTracks.map((track, i) => (
                            <Song
                                key={`${track?.id} ${i}`}
                                track={track}
                                addedAt={false}
                                order={i}
                                songInfo={songInfo}
                                isPlaying={isPlaying}
                                parentId={parentId}
                                type={'top-tracks'}
                                topTrackIsCreatePlaylist={topTrackIsCreatePlaylist}
                                setSelectedTracks={setSelectedTracks}
                                selectedTracks={selectedTracks}
                            />
                        ))
                    }
                </div>
                {
                    selectedTracks.length > 0 &&
                    <Button
                        onClick={handleCreatePlaylistClick}
                        className='!fixed !p-5 !text-gray-300 !text-xs !rounded-full !bg-[#1ED760] !w-fit !bottom-[109px] !right-5 hover:!bg-[#1ED760]'
                    >
                        Create
                    </Button>

                }

            </div>
        </div>
    )
}

export default TopTracks

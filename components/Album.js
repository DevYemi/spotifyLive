/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import HeaderNav from './HeaderNav'
import Link from 'next/link';
import { calBodyOfWorkDuration } from '../lib/time'
import { shuffle } from 'lodash';
import useSpotify from '../customHooks/useSpotify';
import { ClockIcon, DotsHorizontalIcon, HeartIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline'
import { handlePlayAndPauseOfPlayer, startPlayingListOfSongs, toggleSavedAlbum } from '../utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../globalState/songAtom';
import useSongInfo from '../customHooks/useSongInfo';
import AlbumSong from './AlbumSong';
import MusicCard from './MusicCard';
import { albumDetailsState } from '../globalState/albumAtom';
import { popMssgTypeState } from '../globalState/popMessageAtom';

const colors = [
    // random colors created to be shuffled
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-orange-500",
]

function Album({ albumDetails }) {
    // console.log('album');
    const songInfo = useSongInfo(); // custom hook that gets the info of the current playing song
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); // Atom global state
    const setAlbumDetails = useSetRecoilState(albumDetailsState) // Atom global state
    const setPopMssgType = useSetRecoilState(popMssgTypeState) // Atom global state
    const [{ parentId }, setCurrentTrackId] = useRecoilState(currentTrackIdState); // Atom global state
    const [color, setColor] = useState(null); // keeps state of the current color that was selected after shuffle
    const [albumOwnerDetails, setAlbumOwnerDetails] = useState(null); // keeps state of the details of the owner album
    const [isAlbumSaved, setIsAlbumSaved] = useState(false); // keeps state an Album is saved in a user music libary
    const [albumIsCreatePlaylist, setAlbumIsCreatePlaylist] = useState(false); // keeps state if a user is currently trying to create a playlist from the album
    const [moreFromArtist, setMoreFromArtist] = useState([]) // keeps state of more music from displayed artist
    const spotifyApi = useSpotify();


    useEffect(() => {
        // on first render map albumDetails to global state
        setAlbumDetails(albumDetails);
    }, [albumDetails, setAlbumDetails])
    useEffect(() => {

        // Check if albums are in the signed in user's Your Music library
        if (!spotifyApi.getAccessToken()) return
        spotifyApi.containsMySavedAlbums([albumDetails?.id])
            .then(function (data) {

                // An array is returned, where the first element corresponds to the first album ID in the query
                var albumIsInYourMusic = data.body[0];

                if (albumIsInYourMusic) return setIsAlbumSaved(true)
                setIsAlbumSaved(false);

            }).catch(err => console.log(err))
    }, [albumDetails, spotifyApi])
    useEffect(() => {
        // get the album owner details on first render 
        spotifyApi.getArtist(albumDetails?.artists[0]?.id)
            .then(data => {
                setAlbumOwnerDetails(data.body)
            }).catch(err => console.log(err))
        setColor(shuffle(colors).pop())
    }, [spotifyApi, albumDetails]);

    useEffect(() => {
        // Get more Music on Artist
        // Get albums by a certain artist
        if (!spotifyApi.getAccessToken()) return
        spotifyApi.getArtistAlbums(albumDetails?.artists[0]?.id)
            .then(data => {
                let artistAlbums = data?.body?.items
                setMoreFromArtist(shuffle([...artistAlbums]).slice(0, 8))
            }).catch(err => console.log(err))
    }, [spotifyApi, albumDetails])
    return (
        <div
            className='ALBUM flex-grow scrollbar-style pb-[1em] text-white overflow-scroll h-[90vh]'>
            <HeaderNav color={'red'} gsapTrigger={'.ALBUM-SECTION-1'} gsapScroller={'.ALBUM '} />
            <section className={`ALBUM-SECTION-1 flex flex-col items-center space-x-7 bg-gradient-to-b ${color} to-black  text-white p-8 md:flex-row md:items-end md:h-80`}>
                <div
                    className=' group relative shadow-2xl flex justify-center items-center h-[179px] w-[179px] bg-[#282828]'>
                    <img
                        className='h-full object-cover'
                        src={albumDetails?.images[0]?.url}
                        alt='' />
                </div>

                <div className='mt-4 md:mt-0'>
                    <p className='text-[.8rem] font-semibold'>{albumDetails?.album_type.toUpperCase()}</p>
                    <div>
                        <h1 className='text-1xl md:text-5xl xl:text-6xl font-bold'>{albumDetails?.name}</h1>
                    </div>
                    <div className='flex  items-center space-x-1'>
                        <span className='h-6 w-6 rounded-full inline-block'>
                            {albumOwnerDetails &&
                                <img src={albumOwnerDetails?.images[0]?.url} alt="" className='rounded-full' />
                            }

                        </span>
                        <span className='text-sm font-light hover:underline '>
                            <Link href={albumDetails?.artists[0]?.external_urls.spotify}>
                                <a target="_blank">{albumDetails?.artists[0]?.name}</a>
                            </Link>
                        </span>
                        <span className='text-[40px] translate-y-[-12px] mr-1 ml-1 '>.</span>
                        <span className='text-[8px] font-light md:text-sm'>{albumDetails?.release_date.slice(0, 4)}</span>
                        <span className='text-[40px] translate-y-[-12px] mr-1 ml-1'>.</span>
                        <span className='text-[8px] font-light md:text-sm '>{albumDetails?.tracks?.total} songs,</span>
                        <span className='text-[8px] font-light ml-1 text-gray-300 md:text-xs '>{calBodyOfWorkDuration(albumDetails, 'album')}</span>
                    </div>



                </div>
            </section>

            <section className='ALBUM-SECTION-2 flex px-6 items-center space-x-5 mb-5'>
                {
                    (isPlaying && albumDetails?.id === parentId) ?
                        <PauseIcon onClick={() => handlePlayAndPauseOfPlayer(spotifyApi, setIsPlaying)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                        :
                        <PlayIcon onClick={() => startPlayingListOfSongs(albumDetails, 0, setCurrentTrackId, setIsPlaying, parentId, spotifyApi)} className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                }
                {
                    <>
                        {
                            isAlbumSaved ?
                                <HeartIcon onClick={() => toggleSavedAlbum("UN-SAVE", albumDetails, setIsAlbumSaved, setPopMssgType, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                                :
                                <HeartIconOutline onClick={() => toggleSavedAlbum("SAVE", albumDetails, setIsAlbumSaved, setPopMssgType, spotifyApi)} className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                        }


                    </>

                }

                <DotsHorizontalIcon className='h-6 w-6 text-gray-500 cursor-pointer' />

            </section>
            <section className="ALBUM-SECTION-3 px-5 flex flex-col space-y-1 md:px-8">
                <div className='flex px-5 uppercase text-sm font-bold justify-between text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                    <p className=''># Title</p>
                    <p className=''><ClockIcon className='h-5 w-5' /></p>

                </div>
                {
                    albumDetails?.tracks?.items?.map((track, i) => (
                        <AlbumSong
                            key={`${track?.id} ${i}`}
                            track={track}
                            parentId={parentId}
                            albumIsCreatePlaylist={albumIsCreatePlaylist}
                            albumDetails={albumDetails}
                            songInfo={songInfo}
                            isPlaying={isPlaying}
                            order={i}
                        />
                    ))
                }
            </section>
            <section className="ALBUM-SECTION-4 pl-[36px] text-[8px] mt-5 text-[#797676] md:pl-[50px]">
                {albumDetails?.copyrights[0]?.text && <p>&copy; {albumDetails?.copyrights[0]?.text}</p>}
                {albumDetails?.copyrights[1]?.text && <p>&#8471; {albumDetails?.copyrights[1]?.text}</p>}
            </section>

            <section className="ALBUM-SECTION-5 mt-5 pl-[36px] md:pl-[50px]">
                <h2 className='text-xl font-semibold'>More from {albumDetails?.artists[0]?.name}</h2>
                <div className='flex flex-wrap justify-evenly mt-5 '>
                    {moreFromArtist.length > 0 && moreFromArtist.map((track, i) => (
                        <MusicCard
                            key={`${track?.id} ${i}`}
                            track={track}
                            type={'ALBUM'}
                        />

                    ))

                    }

                </div>
            </section>
        </div>
    )
}

export default Album
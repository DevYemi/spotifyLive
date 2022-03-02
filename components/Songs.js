import { ClockIcon, DotsHorizontalIcon, HeartIcon, PlayIcon } from '@heroicons/react/solid'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../globalState/playlistsAtom'
import Song from './Song'

function Songs() {
    const playlist = useRecoilValue(playlistState)
    return (
        <div className=''>
            <div className='flex px-6 items-center space-x-5 mb-5'>
                <PlayIcon className='h-[4rem] w-[4rem] text-[#1ED760] cursor-pointer' />
                <HeartIcon className='h-10 w-10 text-[#1ED760] cursor-pointer' />
                <DotsHorizontalIcon className='h-6 w-6 text-gray-500 cursor-pointer' />
            </div>

            <div className='px-8 flex flex-col space-y-1 pb-28'>
                <div className='grid px-5 uppercase text-sm font-bold grid-cols-2 text-gray-500 pt-4 pb-1 border-b border-gray-600'>
                    <p className=''># Title</p>

                    <div className='flex items-center justify-between ml-auto md:ml-0'>
                        <p className='w-40 hidden md:inline'>Album</p>
                        <p className='hidden lg:inline'>Date Added</p>
                        <p className=''><ClockIcon className='h-5 w-5' /></p>
                    </div>
                </div>
                {
                    playlist?.tracks.items.map(({ track, added_at }, i) => (
                        <Song
                            key={track?.id}
                            track={track}
                            addedAt={added_at}
                            order={i}
                        />
                    ))
                }
            </div>

        </div>
    )
}

export default Songs
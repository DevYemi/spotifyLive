/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useSession, signOut } from 'next-auth/react'
import { headerNavAnimations } from '../lib/gsapAnimation'
function HeaderNav({ color }) {
    const { data: session } = useSession();  // get the current logged in user session
    useEffect(() => {
        headerNavAnimations(color);
    }, [color])
    return (
        <header className='relative'>
            <div className={`HEADER-NAV fixed p-3 flex w-[80%]`}>
                <div className="NAV-ICONS flex flex-1 ">
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black'>
                        <ChevronLeftIcon className='h-6 w-6' />
                    </span>
                    <span className=' p-1 h-fit rounded-full cursor-pointer bg-black ml-4'>
                        <ChevronRightIcon className='h-6 w-6' />
                    </span>


                </div>
                <div
                    onClick={signOut}
                    className='flex items-center  bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
                    <img
                        className='rounded-full w-7 h-7'
                        src={session?.user?.image}
                        alt="User Avatar" />
                    <h2 className='text-sm'>{session?.user?.name}</h2>
                    <ChevronDownIcon className='h-4 w-4' />
                </div>
            </div>

        </header>
    )
}

export default HeaderNav
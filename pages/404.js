import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import HeaderNav from '../components/common/HeaderNav'

function NotFound() {
    return (
        <div className='404-WR flex-grow scrollbar-style pb-[1em] text-white overflow-scroll h-[90vh]'>
            <HeaderNav color={''} gsapTrigger={''} gsapScroller={''} />
            <div className='flex text-gray-600 space-y-9 flex-col justify-center items-center h-full'>
                <div className='flex items-center'>
                    <ExclamationCircleIcon className='h-20 w-20 text-gray-600' />
                    <p>PAGE NOT FOUND</p>
                </div>

                <Link href='/'>
                    <a className='block text-white py-2 px-5 rounded-md bg-primary hover:bg-primary'>Go Back Home </a>
                </Link>
            </div>

        </div>
    )
}

export default NotFound
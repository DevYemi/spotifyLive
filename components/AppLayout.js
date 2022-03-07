import React from 'react'
import Sidebar from './../components/Sidebar'
import Player from '../components/Player'
import { useSession } from 'next-auth/react';

function AppLayout({ children }) {
    const { data: session } = useSession();  // get the current logged in user session

    if (session) {
        return (
            <div className="bg-black h-screen overflow-hidden">
                <main className='flex h-[88vh] relative'>
                    <Sidebar />
                    {children}
                </main>
                <div className='sticky bottom-0'>
                    <Player />
                </div>
            </div>
        )
    } else {
        // return login page
        return <> {children}</>
    }

}

export default AppLayout
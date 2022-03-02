import React from 'react'
import Sidebar from './../components/Sidebar'
import Player from '../components/Player'

function AppLayout({ children }) {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <main className='flex'>
                <Sidebar />
                {children}
            </main>
            <div className='sticky bottom-0'>
                <Player />
            </div>
        </div>
    )
}

export default AppLayout
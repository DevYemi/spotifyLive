import React, { useEffect } from 'react'
import Sidebar from './../components/Sidebar'
import Player from '../components/Player'
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { preventRoutingPageLoadingState, routingPageLoadingState } from '../globalState/loadingAtom';
import { useRouter } from 'next/router';
import PageLoading from './PageLoading'
import PopUpMessage from './common/PopUpMessage'

function AppLayout({ children }) {
    const { data: session } = useSession();  // get the current logged in user session

    const [routingPageLoading, setRoutingPageLoading] = useRecoilState(routingPageLoadingState);
    const [preventRoutingPageLoading, setPreventRoutingPageLoading] = useRecoilState(preventRoutingPageLoadingState);
    const router = useRouter();
    useEffect(() => {
        // sets loading state when a user is routing through pages
        const handleStart = () => {
            if (preventRoutingPageLoading) return
            setRoutingPageLoading(true);
        }

        const handleStop = () => {
            setRoutingPageLoading(false);
            setPreventRoutingPageLoading(false);
        }

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        }
    }, [router, setRoutingPageLoading, setPreventRoutingPageLoading, preventRoutingPageLoading])

    if (session) {
        return (
            <div className="bg-black h-screen overflow-hidden">
                <main className='flex h-[88vh] relative'>
                    <Sidebar />
                    <div className=' relative flex flex-1'>
                        {
                            routingPageLoading ? <PageLoading /> : children
                        }
                        <PopUpMessage />
                    </div>


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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

function useUser() {
    const { data: session } = useSession();  // get the current logged in user session
    const router = useRouter();

    useEffect(() => {
        // redirect user to login page if there is no user
        if (!session) return router.push('/login');
    }, [session, router]);
    return session
}

export default useUser
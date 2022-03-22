/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { getProviders, getSession, signIn } from 'next-auth/react'

function Login({ providers }) {
    return (
        <div className='bg-[black] flex flex-col items-center justify-center h-screen w-full'>
            <img src="https://links.papareact.com/9xl" alt="Spotify Logo" className="w-52 mb-5" />
            {Object.values(providers).map(provider => (
                <div key={provider.name}>
                    <button
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                        className='bg-[#1ED760] text-white p-5 rounded-full'>
                        Login With {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login

export async function getServerSideProps(context) {
    const session = await getSession(context); // get session
    if (session) return { redirect: { destination: '/', permanent: false, } } // Redirect to home page if there is a user
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}
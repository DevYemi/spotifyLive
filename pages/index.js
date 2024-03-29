import { EyeIcon, PlayIcon } from "@heroicons/react/solid";
import HeaderNav from '../components/common/HeaderNav'
import Link from "next/link";
import { getSession } from "next-auth/react";



function Home() {



  return (
    <div className="HOME-WR text-white flex-1 overflow-y-scroll scrollbar-style">
      <HeaderNav color={"red"} gsapScroller={'.HOME-WR'} gsapTrigger={'.HOME'} />
      <div className=" HOME pt-[6rem]">
        <h1 className="text-[3rem] text-center">SPOTIFY STATS</h1>
        <div className="flex flex-col items-center w-fit p-[1.5em] mx-auto my-[2em] rounded-md border border-white">
          <Link href='/top-tracks/short_term'>
            <a className="bg-[#1ED760] px-[2em] py-[.5em] rounded-sm">
              Show Me My Top Tracks
            </a>
          </Link>
          <Link href='/top-artists/short_term'>
            <a className="bg-[#1ED760] px-[1em] py-[.5em] rounded-sm mt-4">
              Show Me My Favourite Artists
            </a>
          </Link>
        </div>
        <p className="text-center">What can i do here ??</p>
        <div className="flex items-center">
          <PlayIcon className=" w-[50%] h-[50%] max-w-[150px] text-[#1ED760]" />
          <p>Play Your Favourite Songs</p>
        </div>
        <div className="flex items-center">
          <EyeIcon className=" w-[50%] h-[50%] max-w-[150px] text-[#1ED760]" />
          <p>View And Stream From Your Favourite Playlist</p>
        </div>
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context); // get session
    if (!session) return { redirect: { destination: '/login', permanent: false, } } // Redirect to login page if there is no user
  } catch (err) {
    console.log(err)
  }
  return {
    props: {
      data: null
    }
  }
}





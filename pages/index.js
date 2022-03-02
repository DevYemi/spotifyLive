import PlaylistInfo from '../components/PlaylistInfo'
import { getSession } from 'next-auth/react';

const Home = () => {
  return <PlaylistInfo />
}

export default Home

export async function getServerSideProps(context) {
  const session = await getSession(context);


  return {
    props: {
      session
    }
  }
}

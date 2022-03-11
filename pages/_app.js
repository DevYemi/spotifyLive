import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import AppLayout from '../components/AppLayout'
import '../styles/globals.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} >
      <RecoilRoot>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </RecoilRoot>
    </SessionProvider>
  )


}

export default MyApp

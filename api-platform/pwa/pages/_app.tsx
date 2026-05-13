import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type { AppProps } from "next/app"
import type { DehydratedState } from "@tanstack/react-query"
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service Worker registration failed:', err)
      })
    }
  }, [])

  return <Layout dehydratedState={pageProps.dehydratedState}>
    <Component {...pageProps} />
  </Layout>
}

export default MyApp

import '../styles/globals.css'
// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'configs/themeConfig'

// ** Component Imports
import UserLayout from 'layouts/UserLayout'
import ThemeComponent from '@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from '@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from '@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

function MyApp({ Component, pageProps }: ExtendedAppProps) {
  // const getLayout = Component.getLayout ?? (page => page) //?? (page => <UserLayout>{page}</UserLayout>)
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
      </Head>
      <SettingsProvider>
        <SettingsConsumer>
          {({settings})=>{
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>

    </CacheProvider>
  )
  // return (
  //   getLayout(<Component {...pageProps} />)
  // )
  //return <Component {...pageProps} />
}

export default MyApp

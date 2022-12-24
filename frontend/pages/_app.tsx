import Head from 'next/head';
import { Global } from '@emotion/react';
import xw from 'xwind';
import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useApollo } from '../lib/apolloClient';
import { UserContextProvider } from '../utils/userContext';
import { URLContextProvider } from '../utils/urlContext';
import { BookmarkContextProvider } from '../utils/bookmarkContext';
import { UniversityListContextProvider } from '../utils/universityListContext';
import { CourseListContextProvider } from '../utils/courseListContext';
import { CompetitivePapersListContextProvider } from '../utils/competitivePapersListContext';
import * as gtag from '../lib/gtag';

interface PropTypes {
  Component?: any;
  pageProps?: any;
}

function App({ Component, pageProps }: PropTypes) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url:string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <UserContextProvider>
        <URLContextProvider>
          <BookmarkContextProvider>
            <UniversityListContextProvider>
              <CourseListContextProvider>
                <CompetitivePapersListContextProvider>
                  <>
                    <Head>
                      <title>Exam Central</title>
                      <style>
                        {`
                      @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

                      body {
                          font-family: 'Montserrat', sans-serif !important;
                      }
                    `}
                      </style>
                    </Head>
                    <Global
                      styles={xw`XWIND_BASE XWIND_GLOBAL`}
                    />
                    <Component {...pageProps} />
                  </>
                </CompetitivePapersListContextProvider>
              </CourseListContextProvider>
            </UniversityListContextProvider>
          </BookmarkContextProvider>
        </URLContextProvider>
      </UserContextProvider>
    </ApolloProvider>
  )
}

export default App;

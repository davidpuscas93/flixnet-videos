import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import Spinner from '@/components/spinner/spinner';

import '@/styles/globals.css';

import styles from '@/styles/App.module.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', () => setLoading(true));
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', () => setLoading(true));
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router]);

  return loading ? (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <main className={styles.container}>
        <Spinner />
      </main>
    </>
  ) : (
    <Component {...pageProps} />
  );
}

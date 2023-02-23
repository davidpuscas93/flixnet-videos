import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { magicClient } from '@/lib/magic-client';

import netflixLogo from '@/public/static/netflix-logo.svg';

import Loading from '@/components/loading/loading';

import styles from '@/styles/Login.module.css';

const E_MAIL_REGEX = '/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmailMessage('');
    setEmail(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email) {
      try {
        const DID_TOKEN = await magicClient.auth.loginWithMagicLink({
          email,
        });
        if (DID_TOKEN) {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${DID_TOKEN}`,
            },
          });

          const data = await response.json();
          data.loggedIn && router.push('/');
        }
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
        setLoading(false);
      }
    } else {
      setEmailMessage('Enter a valid e-mail address!');
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Flixnet Login</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href='/'>
            <div className={styles.logoWrapper}>
              <Image
                src={netflixLogo}
                width='128'
                height='48'
                alt='netflix-logo'
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.title}>W E L C O M E</h1>
          <input
            type='text'
            placeholder='E-mail'
            className={styles.emailInput}
            onChange={handleEmailChange}
          />
          <p className={styles.emailInputMessage}>{emailMessage}</p>
          <button onClick={handleLogin} className={styles.loginButton}>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: '1.75rem',
                  justifyContent: 'center',
                }}
              >
                <Loading isWhite={true} />
              </div>
            ) : (
              'LOG IN'
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;

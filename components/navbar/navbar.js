import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { magicClient } from '@/lib/magic-client';

import { useDelayedUnmount } from '@/hooks/use-delayed-unmount';

import netflixLogo from 'public/static/netflix-logo.svg';
import expandMore from 'public/static/icons/expand_more.svg';

import Loading from '@/components/loading/loading';

import styles from './navbar.module.css';

const Navbar = () => {
  const [displayUsername, setDisplayUsername] = useState(false);
  const [displayLogout, setDisplayLogout] = useState(false);
  const [username, setUsername] = useState('');
  const [didToken, setDidToken] = useState('');

  const displayNavContent = useDelayedUnmount(displayUsername, 2500);
  const displayNavDropdown = useDelayedUnmount(displayLogout, 2500);

  const router = useRouter();

  const mountedStyle = {
    animation: `${styles.fadeIn} 400ms ease-in`,
  };

  const unmountedStyle = {
    animation: `${styles.fadeOut} 400ms ease-out`,
    animationFillMode: 'forwards',
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push('/favorites');
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setDisplayLogout(!displayLogout);
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${didToken}`,
        },
      });
    } catch (error) {
      console.error(`Something went wrong while logging out: ${error}`);
      router.push('/login');
    }
  };

  useEffect(() => {
    const configureNavbar = async () => {
      try {
        const { email } = await magicClient.user.getMetadata();
        const didToken = await magicClient.user.getIdToken();
        if (email) {
          setDisplayUsername(true);
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.error(`Could not fetch e-mail address: ${error}`);
      }
    };
    configureNavbar();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickMyList}>
            Favorites
          </li>
        </ul>
        <nav className={styles.navContainer}>
          {displayNavContent ? (
            <div
              className={styles.navContent}
              style={displayUsername ? mountedStyle : unmountedStyle}
            >
              <button
                className={styles.usernameButton}
                onClick={handleShowDropdown}
              >
                <p className={styles.username}>{username}</p>
                <Image
                  src={expandMore}
                  width='20'
                  height='20'
                  alt='expand-arrow'
                  style={{
                    transform: !displayLogout
                      ? 'rotate(-90deg)'
                      : 'rotate(0deg)',
                    transitionDuration: '200ms',
                  }}
                />
              </button>
              {displayNavDropdown && (
                <div
                  className={styles.navDropdown}
                  style={displayLogout ? mountedStyle : unmountedStyle}
                >
                  <div>
                    <button className={styles.linkName} onClick={handleLogout}>
                      LOG OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '8rem',
              }}
            >
              <Loading />
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

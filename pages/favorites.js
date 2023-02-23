import Head from 'next/head';

import { getLikedVideos } from '@/lib/videos';

import { getUserSession } from '@/helpers';

import Navbar from '@/components/navbar/navbar';
import CardSection from '@/components/card-section/card-section';

import styles from '@/styles/Favorites.module.css';

export async function getServerSideProps(context) {
  const { token, userId } = await getUserSession(context);

  const likedData =
    (token && userId && (await getLikedVideos(userId, token))) || [];

  return {
    props: {
      likedData,
    },
  };
}

export default function Favorites({ likedData }) {
  return (
    <div>
      <Head>
        <title>Favorites</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          {likedData && likedData.length ? (
            <CardSection
              title='F A V O R I T E S'
              videos={likedData}
              size='small'
              shouldWrap={true}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

import Head from 'next/head';

import Banner from '@/components/banner/banner';
import Navbar from '@/components/navbar/navbar';
import CardSection from '@/components/card-section/card-section';

import { getVideos, getPopularVideos, getWatchedVideos } from '@/lib/videos';

import { getUserSession } from '@/helpers';

import styles from '@/styles/Home.module.css';

export async function getServerSideProps(context) {
  const { token, userId } = await getUserSession(context);

  const battlefieldData = await getVideos(
    'Battlefield 2042 trailers',
    'Battlefield'
  );
  const playstationData = await getVideos(
    'PlayStation trailers',
    'PlayStation'
  );
  const xboxData = await getVideos('Xbox trailers', 'Xbox');

  const watchItAgainData =
    (token && userId && (await getWatchedVideos(userId, token))) || [];

  const movieData = await getVideos('Movie trailers');
  const popularData = await getPopularVideos();

  return {
    props: {
      battlefieldData,
      playstationData,
      xboxData,
      watchItAgainData,
      movieData,
      popularData,
    },
  };
}

export default function Home(props) {
  const {
    battlefieldData,
    playstationData,
    xboxData,
    watchItAgainData,
    movieData,
    popularData,
  } = props;

  return (
    <div>
      <Head>
        <title>Flixnet</title>
        <meta name='description' content='A place to watch videos.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Navbar />
        <Banner
          videoId='ej3ioOneTy8'
          title='The Martian'
          subtitle='The thrilling sci-fi epic of the year starring Matt Damon.'
          image='/static/the-martian.jpg'
        />
        <div className={styles.sectionWrapper}>
          {battlefieldData && battlefieldData.length ? (
            <CardSection
              title='B A T T L E F I E L D'
              size={'large'}
              videos={battlefieldData}
            />
          ) : null}
          {playstationData && playstationData.length ? (
            <CardSection
              title='P L A Y S T A T I O N'
              size={'medium'}
              videos={playstationData}
            />
          ) : null}
          {xboxData && xboxData.length ? (
            <CardSection title='X B O X' size={'small'} videos={xboxData} />
          ) : null}
          {watchItAgainData && watchItAgainData.length ? (
            <CardSection
              title='W A T C H   I T   A G A I N'
              size={'small'}
              videos={watchItAgainData}
            />
          ) : null}
          {movieData && movieData.length ? (
            <CardSection
              title='M O V I E S'
              size={'small'}
              videos={movieData}
            />
          ) : null}
          {popularData && popularData.length ? (
            <CardSection
              title='P O P U L A R'
              size={'small'}
              videos={popularData}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

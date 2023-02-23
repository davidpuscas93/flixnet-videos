import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import Modal from 'react-modal';

import Navbar from '@/components/navbar/navbar';

import { getVideoById } from '@/lib/videos';
import { useDelayedUnmount } from '@/hooks/use-delayed-unmount';

import { Like, Dislike } from '@/components/icons';

import styles from '@/styles/Video.module.css';

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
  const video = await getVideoById(context.params.videoId);

  return {
    props: {
      video: video.length ? video[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ['ej3ioOneTy8', 'PMqvC507g1M', 'Ro26B394ZBM'];

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

const Video = ({ video }) => {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [displayFavoriteButtons, setDisplayFavoriteButtons] = useState(false);

  const displayFavoriteContainer = useDelayedUnmount(
    displayFavoriteButtons,
    2500
  );

  const { videoId } = router.query;

  const handleModalClose = () => {
    router.back();
  };

  const { title, published, description, channel, views, likes } = video;

  const mountedStyle = {
    animation: `${styles.fadeIn} 400ms ease-in`,
  };

  const unmountedStyle = {
    animation: `${styles.fadeOut} 400ms ease-out`,
    animationFillMode: 'forwards',
  };

  const convertDate = (date) => {
    const newDate = new Date(date);
    return newDate.toDateString();
  };

  const convertViews = (views) => {
    if (views >= 1000000) {
      return `${views / 1000000}M`;
    } else if (views >= 1000) {
      return `${views / 1000}K`;
    } else {
      return views;
    }
  };

  const handleUpdateOrCreateStats = async (favorited) => {
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        favorited,
      }),
    });

    const data = await response.json();
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setDisliked(false);
    handleUpdateOrCreateStats(newLiked ? 1 : null);
  };

  const handleDislike = () => {
    const newDisliked = !disliked;
    setDisliked(newDisliked);
    setLiked(false);
    handleUpdateOrCreateStats(newDisliked ? -1 : null);
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (videoId) {
        const response = await fetch(`/api/stats?videoId=${videoId}`);
        const { stats } = await response.json();
        if (stats) {
          const { favorited } = stats;
          if (favorited === 1) {
            setLiked(true);
          } else if (favorited === -1) {
            setDisliked(true);
          }
        }
        setDisplayFavoriteButtons(true);
      }
    };
    fetchStats();
  }, [videoId]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel='Watch the video'
        onRequestClose={handleModalClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id='ytplayer'
          type='text/html'
          width='100%'
          height='50%'
          allowFullScreen
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=1&rel=0`}
          className={styles.videoPlayer}
        ></iframe>

        {displayFavoriteContainer && (
          <div
            className={styles.likeDislikeButtonWrapper}
            style={displayFavoriteButtons ? mountedStyle : unmountedStyle}
          >
            <button onClick={handleLike}>
              <div className={styles.buttonWrapper}>
                <Like selected={liked} />
              </div>
            </button>
            <button onClick={handleDislike}>
              <div className={styles.buttonWrapper}>
                <Dislike selected={disliked} />
              </div>
            </button>
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.content}>
            <div className={styles.firstColumn}>
              <p className={styles.published}>{convertDate(published)}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.secondColumn}>
              <p className={styles.metadata}>
                <span>Channel: </span>
                <span className={styles.secondaryText}>{channel}</span>
              </p>
              <p className={styles.metadata}>
                <span>Views: </span>
                <span className={styles.secondaryText}>
                  {convertViews(views)}
                </span>
              </p>
              <p className={styles.metadata}>
                <span>Likes: </span>
                <span className={styles.secondaryText}>
                  {convertViews(likes)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;

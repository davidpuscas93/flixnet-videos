import Image from 'next/image';

import { useRouter } from 'next/router';

import styles from './banner.module.css';

import playArrow from 'public/static/icons/play_arrow.svg';

const Banner = (props) => {
  const { videoId, title, subtitle, image } = props;

  const router = useRouter();

  const handleOnPlay = (e) => {
    e.preventDefault();
    router.push(`/video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.leftWrapper}>
          <div className={styles.netflixFilmWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.film}>F I L M</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subtitle}>{subtitle}</h3>
          <div className={styles.playWrapper}>
            <button className={styles.playButton} onClick={handleOnPlay}>
              <Image src={playArrow} width='32' height='32' alt='play-arrow' />
              <span className={styles.playText}>P L A Y</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
    </div>
  );
};

export default Banner;

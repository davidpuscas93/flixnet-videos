import Link from 'next/link';

import cls from 'classnames';

import Card from '@/components/card/card';

import styles from './card-section.module.css';

const CardSection = (props) => {
  const {
    title = 'Popular',
    size = 'medium',
    videos,
    shouldWrap = false,
  } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.content, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => (
          <Link key={index} href={`video/${video.id}`}>
            <Card
              id={video.id}
              title={video.title}
              image={video.image}
              size={size}
              isFirst={index === 0}
              isLast={index === videos.length - 1}
              shouldWrap={shouldWrap}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CardSection;

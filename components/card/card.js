import { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import cls from 'classnames';

import styles from './card.module.css';

const Card = (props) => {
  const {
    id,
    title,
    image = '/static/default-image.jpg',
    size = 'medium',
    isFirst,
    isLast,
    shouldWrap = false,
  } = props;

  const [defaultImage, setDefaultImage] = useState(image);

  const classMap = {
    large: styles.largeItem,
    medium: styles.mediumItem,
    small: styles.smallItem,
  };

  const calculateImageSizes = () => {
    switch (size) {
      case 'large':
        return '(min-width: 768px) 218px, (min-width: 640px) 109px, 72px';
      case 'medium':
        return '(min-width: 768px) 158px, (min-width: 640px) 79px, 52px';
      case 'small':
        return '(min-width: 768px) 300px, (min-width: 640px) 150px, 75px';
    }
  };

  const handleOnImageError = () => {
    setDefaultImage('/static/default-image.jpg');
  };

  const scale = isFirst || isLast ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div
      className={cls(styles.container, shouldWrap && styles.wrappedContainer)}
    >
      <motion.div
        className={cls(styles.imageMotionWrapper, classMap[size])}
        whileHover={{ ...scale }}
      >
        <Image
          src={defaultImage}
          alt={`${id}-${title}`}
          onError={handleOnImageError}
          fill
          className={styles.image}
          sizes={calculateImageSizes()}
        />
      </motion.div>
    </div>
  );
};

export default Card;

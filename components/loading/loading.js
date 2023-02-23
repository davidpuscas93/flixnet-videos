import cls from 'classnames';

import styles from './loading.module.css';

const Loading = ({ isWhite }) => {
  const colorStyle = {
    backgroundColor: isWhite ? 'var(--white10)' : 'var(--black10)',
    color: isWhite ? 'var(--white10)' : 'var(--black10)',
  };

  return (
    <div
      className={cls(styles.collision, isWhite ? styles.white : styles.black)}
      style={colorStyle}
    />
  );
};

export default Loading;

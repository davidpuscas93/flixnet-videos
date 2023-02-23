import { useState, useEffect } from 'react';

export function useDelayedUnmount(isMounted, delay = 1000) {
  const [displayElement, setDisplayElement] = useState(false);

  useEffect(() => {
    let timeout;

    if (isMounted && !displayElement) {
      setDisplayElement(true);
    } else if (!isMounted && displayElement) {
      timeout = setTimeout(() => {
        setDisplayElement(false);
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [isMounted, displayElement, delay]);

  return displayElement;
}

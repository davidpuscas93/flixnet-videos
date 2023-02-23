import { Magic } from 'magic-sdk';

const initializeMagic = () => {
  return (
    typeof window !== 'undefined' &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  );
};

export const magicClient = initializeMagic();

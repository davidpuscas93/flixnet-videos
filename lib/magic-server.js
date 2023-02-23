import { Magic } from '@magic-sdk/admin';

export const magicServer = new Magic(process.env.MAGIC_SECRET_KEY);

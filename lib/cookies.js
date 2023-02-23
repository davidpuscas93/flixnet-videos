import cookie from 'cookie';

const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export const setTokenCookie = (token, res) => {
  const tokenCookie = cookie.serialize('token', token, {
    secure: process.env.NODE_ENV !== 'development',
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    path: '/',
  });

  res.setHeader('Set-Cookie', tokenCookie);
};

export const removeTokenCookie = (res) => {
  const tokenCookie = cookie.serialize('token', '', {
    secure: process.env.NODE_ENV !== 'development',
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', tokenCookie);
};

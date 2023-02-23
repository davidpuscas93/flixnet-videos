import { magicServer } from '@/lib/magic-server';

import { getUserIdFromJwtToken } from '@/helpers';
import { removeTokenCookie } from '@/lib/cookies';

export default async function logout(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'User is not logged in!' });
  }

  try {
    const userId = await getUserIdFromJwtToken(token);
    removeTokenCookie(res);

    try {
      if (userId) {
        await magicServer.users.logoutByIssuer(userId);
      } else {
        console.log('User session not found, redirecting to login!');
      }
    } catch (error) {
      console.log(
        `Could not log out of session: ${error.message}. Redirecting to login!`
      );
    }

    res.redirect(302, '/login');
    res.end();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

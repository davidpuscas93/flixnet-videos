import jwt from 'jsonwebtoken';

import { magicServer } from '@/lib/magic-server';
import { setTokenCookie } from '@/lib/cookies';
import { isNewUserQuery, insertUserQuery } from '@/lib/hasura';

const login = async (req, res) => {
  if (req.method === 'POST') {
    const authorization = req.headers.authorization;

    const DID_TOKEN = authorization?.split('Bearer ')[1];

    if (DID_TOKEN) {
      try {
        const metadata = await magicServer.users.getMetadataByToken(DID_TOKEN);

        const JWT = jwt.sign(
          {
            ...metadata,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': ['user', 'admin'],
              'x-hasura-default-role': 'user',
              'x-hasura-user-id': `${metadata.issuer}`,
            },
          },
          process.env.HASURA_GRAPHQL_JWT_SECRET
        );

        const isNewUser = await isNewUserQuery(`${metadata.issuer}`, JWT);

        setTokenCookie(JWT, res);

        if (isNewUser) {
          await insertUserQuery(metadata, JWT);
          res.status(201).json({ message: 'User created!', loggedIn: true });
        } else {
          res
            .status(200)
            .json({ message: 'Found existing user!', loggedIn: true });
        }
      } catch (error) {
        res.status(500).json({ error: error.message, loggedIn: false });
      }
    }
  } else {
    res
      .status(405)
      .json({ error: `${req.method} method not allowed!`, loggedIn: false });
  }
};

export default login;

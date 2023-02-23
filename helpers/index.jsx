import { jwtVerify } from 'jose';
import cookieParser from 'cookie-parser';

const decodeJwtToken = async (token) => {
  try {
    if (token) {
      const verifiedToken = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.HASURA_GRAPHQL_JWT_SECRET)
      );
      return verifiedToken.payload ? verifiedToken.payload?.issuer : null;
    }
    return null;
  } catch (error) {
    console.log('Error while decoding JWT token: ', error);
    return null;
  }
};

export const getUserIdFromJwtToken = async (token) => {
  const DECODED_USER_ID = await decodeJwtToken(token);
  return DECODED_USER_ID ? DECODED_USER_ID : null;
};

export const getUserSession = async (context) => {
  const token = context.req.cookies.token
    ? cookieParser.JSONCookies(context.req.cookies.token)
    : null;

  if (token) {
    const userId = await getUserIdFromJwtToken(token);
    return {
      token,
      userId,
    };
  } else {
    return null;
  }
};

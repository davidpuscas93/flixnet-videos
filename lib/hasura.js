export async function isNewUserQuery(issuer, token) {
  const operationsDoc = `
    query UserByIssuer($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer
        publicAddress
      }
    }
  `;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'UserByIssuer',
    { issuer },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.users?.length === 0;
}

export async function insertUserQuery(metadata, token) {
  const operationsDoc = `
    mutation InsertUser($issuer: String!, $email: String, $publicAddress: String) {
      insert_users(objects: {issuer: $issuer, email: $email, publicAddress: $publicAddress}) {
        returning {
          id
          email
          issuer
          publicAddress 
        }
      }
    }
  `;

  const { issuer, email, publicAddress } = metadata;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'InsertUser',
    { issuer, email, publicAddress },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data.insert_users.returning[0];
}

export async function findStatsByVideoAndUserId(userId, videoId, token) {
  const operationsDoc = `
    query FindStatsByVideoAndUserId($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        videoId
        favorited
        watched
      }
    }
  `;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'FindStatsByVideoAndUserId',
    { userId, videoId },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.stats?.[0] || null;
}

export async function createStatsByVideoAndUserId(
  userId,
  videoId,
  favorited,
  watched,
  token
) {
  const operationsDoc = `
    mutation CreateStatsByVideoAndUserId($userId: String!, $videoId: String!, $favorited: Int, $watched: Boolean) {
      insert_stats(objects: {userId: $userId, videoId: $videoId, favorited: $favorited, watched: $watched}) {
        returning {
          id
          userId
          videoId
          favorited
          watched
        }
      }
    }
  `;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'CreateStatsByVideoAndUserId',
    { userId, videoId, favorited, watched },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.insert_stats?.returning?.[0] || null;
}

export async function updateStatsByVideoAndUserId(
  userId,
  videoId,
  favorited = null,
  watched,
  token
) {
  const operationsDoc = `
    mutation UpdateStatsByVideoAndUserId($userId: String!, $videoId: String!, $favorited: Int, $watched: Boolean) {
      update_stats(
        where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}},
        _set: {favorited: $favorited, watched: $watched}) {
          returning {
            id
            userId
            videoId
            favorited
            watched
          }
      }
    }
  `;

  const variables = { userId, videoId, watched };
  if (favorited !== null) {
    variables.favorited = favorited;
  }

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'UpdateStatsByVideoAndUserId',
    variables,
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.update_stats?.returning?.[0] || null;
}

export async function getWatchedVideosByUserId(userId, token) {
  const operationsDoc = `
    query GetWatchedVideosByUserId($userId: String!) {
      stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
        id
        videoId
      }
    }
  `;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'GetWatchedVideosByUserId',
    { userId },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.stats || [];
}

export async function getLikedVideosByUserId(userId, token) {
  const operationsDoc = `
    query GetLikedVideosByUserId($userId: String!) {
      stats(where: {userId: {_eq: $userId}, favorited: {_eq: 1}}) {
        id
        videoId
      }
    }
  `;

  const { errors, data } = await queryOrMutateHasuraGraphQL(
    operationsDoc,
    'GetLikedVideosByUserId',
    { userId },
    token
  );

  if (errors) {
    console.error(errors);
  }

  return data?.stats || [];
}

export async function queryOrMutateHasuraGraphQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

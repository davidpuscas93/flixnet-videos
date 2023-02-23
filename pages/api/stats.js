import {
  findStatsByVideoAndUserId,
  updateStatsByVideoAndUserId,
  createStatsByVideoAndUserId,
} from '@/lib/hasura';

import { getUserIdFromJwtToken } from '@/helpers';

const stats = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(403).json({ error: 'Cannot access content without token!' });
    return;
  }

  try {
    const userId = await getUserIdFromJwtToken(token);

    if (req.method === 'POST') {
      const { videoId, favorited, watched = true } = req.body;

      const stats = await findStatsByVideoAndUserId(userId, videoId, token);
      let createdOrUpdatedStats;
      let message;

      if (stats) {
        createdOrUpdatedStats = await updateStatsByVideoAndUserId(
          userId,
          videoId,
          favorited,
          watched,
          token
        );
        message = 'Updated stats!';
      } else {
        createdOrUpdatedStats = await createStatsByVideoAndUserId(
          userId,
          videoId,
          favorited,
          watched,
          token
        );
        message = 'Created stats!';
      }

      if (!createdOrUpdatedStats) {
        res
          .status(500)
          .json({ error: 'Server error: could not update or create stats!' });
        return;
      }

      res.status(201).json({ message, createdOrUpdatedStats });
    } else if (req.method === 'GET') {
      const { videoId } = req.query;

      const stats = await findStatsByVideoAndUserId(userId, videoId, token);

      if (!stats) {
        res
          .status(404)
          .json({ error: 'No stats found for the given video and user!' });
        return;
      }

      res.status(200).json({ stats });
    } else {
      res.status(405).json({ error: `${req.method} method not allowed!` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default stats;

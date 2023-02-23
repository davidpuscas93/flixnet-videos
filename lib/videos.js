import battlefieldVideos from '@/data/battlefieldVideos.json';
import playstationVideos from '@/data/playstationVideos.json';
import xboxVideos from '@/data/xboxVideos.json';

import { getWatchedVideosByUserId, getLikedVideosByUserId } from '@/lib/hasura';

export const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3';

  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();
  return data;
};

export const getCommonVideos = async (url, platform) => {
  try {
    const isDevelopmentData = process.env.DEVELOPMENT_DATA === 'true';

    let data = [];

    if (isDevelopmentData) {
      switch (platform) {
        case 'Battlefield':
          data = battlefieldVideos;
          break;
        case 'PlayStation':
          data = playstationVideos;
          break;
        case 'Xbox':
          data = xboxVideos;
          break;
        default:
          data = battlefieldVideos;
          break;
      }
    } else {
      data = await fetchVideos(url);
    }

    if (data?.error) {
      throw new Error(data.error.message);
    }

    return data.items.map((video) => {
      const id =
        video.id?.videoId || video.id || `${Math.random()}-${Date.now()}`;
      const snippet = video.snippet;

      return {
        id,
        title: snippet.title || null,
        image: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` || null,
        description: snippet.description || null,
        channel: snippet.channelTitle || null,
        published: snippet.publishedAt || null,
        views: video.statistics?.viewCount || null,
        likes: video.statistics?.likeCount || null,
      };
    });
  } catch (error) {
    console.error(`Something went wrong while fetching videos: ${error}`);
    return [];
  }
};

export const getVideos = (searchQuery, platform = 'Battlefield') => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;

  return getCommonVideos(URL, platform);
};

export const getPopularVideos = () => {
  const URL =
    'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=FR';

  return getCommonVideos(URL);
};

export const getVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

async function getFilteredVideos(userId, token, queryFunction) {
  const videos = await queryFunction(userId, token);

  return videos.map((video) => {
    return {
      id: video.videoId,
      image: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
}

export const getWatchedVideos = async (userId, token) => {
  return await getFilteredVideos(userId, token, getWatchedVideosByUserId);
};

export const getLikedVideos = async (userId, token) => {
  return await getFilteredVideos(userId, token, getLikedVideosByUserId);
};

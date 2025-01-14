import axios from 'axios';
import { LRUCache } from 'lru-cache';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const URL = publicRuntimeConfig.url;

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 5,
});

export const getQuestions = async (
  page = 1,
  question = '',
  containerID: any,
): Promise<any> => {
  const params = {
    page: String(page),
    question,
    containerID,
  };
  const urlGetUsers = `${URL}/ai/questions`;
  // const urlGetUsers = `https://e96b-109-245-103-172.ngrok-free.app/ai/questions`;

  try {
    const cacheKey = urlGetUsers;
    const cachedData = cache.get(cacheKey) as Promise<any>;

    if (cachedData) {
      return cachedData;
    }

    const getPeopleList = await axios.get(urlGetUsers, {
      params,
    });
    return getPeopleList.data;
  } catch (error) {
    throw Error('Person acquisition error');
  }
};

import { getUserInfoRequest, getUserInfoResponse } from 'types/backendApiTypes';

const axios = require('axios').default;

export async function getUserInfo({
  baseUrl,
  accessToken,
}: getUserInfoRequest): Promise<getUserInfoResponse> {
  try {
    const { data } = await axios.get(`${baseUrl}/users/me`, {
      headers: {
        Authorization: accessToken,
      },
    });
    return { isFetched: true, data: data };
  } catch (error) {
    console.error(error);
    return { isFetched: false };
  }
}

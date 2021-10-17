import { oAuth2ApiRequest, oAuth2ApiResponse } from 'types/backendApiTypes';
const axios = require('axios').default;

export async function postOauth2({
  code,
  regionId,
}: oAuth2ApiRequest): Promise<oAuth2ApiResponse> {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/oauth`,
      {
        code: code,
        regionId: regionId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return { isFetched: true, data: data };
  } catch (error) {
    console.error(error);
    return { isFetched: false };
  }
}

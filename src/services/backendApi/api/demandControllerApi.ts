import { demandApiRequest, demandApiResponse } from 'types/backendApiTypes';
const axios = require('axios').default;

export async function postDemand({
  baseUrl,
  accessToken,
}: demandApiRequest): Promise<demandApiResponse> {
  try {
    await axios.post(`${baseUrl}/demand`, null, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    });
    return { isFetched: true };
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    if (errorMessage === 'Already Completed') {
      return { isFetched: true };
    } else {
      return { isFetched: false };
    }
  }
}

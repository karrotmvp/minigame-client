import {
  getTownIdRequest,
  getTownIdResponse,
  getTownUserRankRequest,
  getTownUserRankResponse,
} from 'types/backendApiTypes';
const axios = require('axios').default;

// Dependencies: axios, base_url, region_id
export async function getTownId({
  regionId,
}: getTownIdRequest): Promise<getTownIdResponse> {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/town?regionId=${regionId}`
    );
    return { isFetched: true, data: data };
  } catch (error) {
    console.error(error);
    return { isFetched: false };
  }
}

export async function getTownUserRank({
  baseUrl,
  townId,
}: getTownUserRankRequest): Promise<getTownUserRankResponse> {
  try {
    const { data } = await axios.get(`${baseUrl}/towns/${townId}/user-rank`);
    return { isFetched: true, data: data };
  } catch (error) {
    console.error('ERROR: getTownUserRank API', error);
    return { isFetched: false };
  }
}

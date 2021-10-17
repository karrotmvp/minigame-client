import axios from 'axios';
import { getTownIdRequest } from 'types/backendApiTypes';

export async function getTownId(regionId: getTownIdRequest): Promise<any> {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/town?regionId=${regionId}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

import axios from 'axios';
import { postOauth2Request } from 'types/backendApiTypes';

export async function postOauth2({
  code,
  regionId,
}: postOauth2Request): Promise<any> {
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
    return data;
  } catch (error) {
    console.error(error);
  }
}

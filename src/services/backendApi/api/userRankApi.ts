import {
  patchCommentRequest,
  patchCommentResponse,
  patchUserScoreRequest,
  patchUserScoreResponse,
} from 'types/backendApiTypes';

const axios = require('axios').default;

export async function patchUserScore({
  baseUrl,
  accessToken,
  score,
}: patchUserScoreRequest): Promise<patchUserScoreResponse> {
  try {
    await axios.patch(
      `${baseUrl}/user-rank`,
      {
        score: score,
      },
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return { isFetched: true };
  } catch (error) {
    console.error(error);
    return { isFetched: false };
  }
}

export async function patchComment({
  baseUrl,
  accessToken,
  comment,
}: patchCommentRequest): Promise<patchCommentResponse> {
  try {
    await axios.patch(
      `${baseUrl}/user-rank/comment`,
      {
        comment: comment,
      },
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return { isFetched: true };
  } catch (error) {
    console.error(error);
    return { isFetched: false };
  }
}

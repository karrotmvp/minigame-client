/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const largeTextStyle = css`
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;

  font-size: 22px;
  line-height: 161.7%;
  /* or 36px */

  letter-spacing: -0.02em;

  color: #3f3f3f;
`;

const mediumTextStyle = css`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */

  letter-spacing: -0.02em;

  color: #414141;
`;
const emphasizedTextStyle = css`
  font-weight: bold;
  color: #eb5d0e;
`;

export { largeTextStyle, mediumTextStyle, emphasizedTextStyle };

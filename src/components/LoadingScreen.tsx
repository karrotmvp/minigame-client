/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as WaitSvg } from 'assets/svg/wait.svg';

const backgroundStyle = css`
  background: #ffffff;
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: center;
  margin: auto;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  max-width: 400px;
`;
const svgStyle = css`
  // align-items: stretch;
`;

const mainText = css`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 161.7%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.02em;

  color: #3f3f3f;
  margin-bottom: 18px;
`;

export const LoadingScreen = () => {
  return (
    <>
      <div css={backgroundStyle}>
        <WaitSvg css={svgStyle} />
        <h1 css={mainText}>점검중 이에요</h1>
        <p>
          보다 나은 서비스를 제공하기 위해
          <br /> 점검을 진행하고 있어요...
          <br />
        </p>

        <p style={{ fontSize: '10px', paddingTop: '20px' }}>
          점검시간: 11월 12일 금요일 오전 01:30 ~ 10:30
          <br />
          점검 시간은 변경될 수 있으니 양해 부탁 드립니다
        </p>
      </div>
    </>
  );
};

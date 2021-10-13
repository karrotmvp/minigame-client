/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { logEvent } from '@firebase/analytics';
import { ReactComponent as WaitSvg } from 'assets/wait.svg';
import { useEffect } from 'react';
import { analytics } from 'services/firebase/firebaseConfig';

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

const subText = css`
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #7c7c7c;
`;
interface NonServiceAreaProps {
  location: any;
}
const NonServiceArea = (props: NonServiceAreaProps) => {
  useEffect(() => {
    logEvent(analytics, 'non_service_area');
  });
  return (
    <div css={backgroundStyle}>
      <WaitSvg css={svgStyle} />
      <h1 css={mainText}>
        송파구는
        <br />
        아직 준비 중이에요
      </h1>
      <h2 css={subText}>조금만 기다려주세요!</h2>
    </div>
  );
};

export default NonServiceArea;

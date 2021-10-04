/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';
import { largeTextStyle, mediumTextStyle } from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/IndividualLeaderboard';

const headingStyle = css`
  margin: 0 32px;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 161.7%;
`;

const textEmphasize = css`
  color: #ff7a00;
`;

const Home = () => {
  const { push } = useNavigator();
  const handleGameStart = () => {
    push(`/game`);
  };
  return (
    <div>
      <ScreenHelmet title="홈" closeButtonLocation="right" />
        <h1 css={largeTextStyle}>강남구 이웃님! 아직 기록이 없어요</h1>
        <h2 css={mediumTextStyle}>당근 키우기를 이웃들과 함께해요!</h2>
        <IndividualLeaderboard userData={sampleUserData} />
      </div>
      <Button
        size={`fullWidth`}
        position={`bottom`}
        text={`시작하기`}
        onClick={handleGameStart}
      />
    </div>
  );
};

export default Home;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet } from '@karrotframe/navigator';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import IndividualLeaderboard from '../components/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
// import Button from '../components/Button';

const headingStyle = css`
  width: 308px;
  height: 78px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 39px;
`;

const textEmphasize = css`
  color: #ff7a00;
`;

const Leaderboard = () => {
  const { number } = useSelector((state: RootState) => ({
    number: state.increment.number,
  }));

  return (
    <div>
      <ScreenHelmet title="리더보드" appendRight={<AppEjectionButton />} />
      <div>img</div>
      <h2 css={headingStyle}>{number}개의 당근을 수확했어요!</h2>
      <div>
        <span css={textEmphasize}>민수님은 12위</span>
        <h1 css={largeTextStyle}>
          <span css={emphasizedTextStyle}>로제엽떡살인마</span>님은 <br />
          우리동네에서 <span css={emphasizedTextStyle}>384793위</span> 에요!
        </h1>
      </div>
      <IndividualLeaderboard />
      {/* <Button /> */}
      <div></div>
    </div>
  );
};

export default Leaderboard;

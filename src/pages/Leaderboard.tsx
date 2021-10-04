/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import IndividualLeaderboard from '../components/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
// import Button from '../components/Button';
const divStyle = css`
  padding: 20px 26px 0px;
`;

const Leaderboard = () => {
  const { number } = useSelector((state: RootState) => ({
    number: state.increment.number,
  }));
  const { push } = useNavigator();
  const handlePlayAgain = () => {
    push('/game');
  };
  return (
    <div>
      <ScreenHelmet title="리더보드" appendRight={<AppEjectionButton />} />
      <div css={divStyle}>
        <h1 css={largeTextStyle}>
          <span css={emphasizedTextStyle}>로제엽떡살인마</span>님은 <br />
          우리동네에서 <span css={emphasizedTextStyle}>384793위</span> 에요!
        </h1>
        <div
          style={{
            width: `100%`,
            display: `flex`,
            justifyContent: `space-evenly`,
            padding: `20px 0`,
            position: `absolute`,
            bottom: `0`,
            left: `0`,
          }}
        >
          <Button
            size={`medium`}
            position={null}
            text={`다시하기`}
            onClick={handlePlayAgain}
          />
          <Button
            size={`medium`}
            position={null}
            text={`자랑하기`}
            onClick={handlePlayAgain}
          />
        </div>
      </div>
      <IndividualLeaderboard />
      {/* <Button /> */}
      <div></div>
    </div>
  );
};

export default Leaderboard;

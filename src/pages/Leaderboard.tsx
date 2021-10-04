/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import IndividualLeaderboard from '../components/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
import { sampleUserData } from 'sampleUserData';
// import Button from '../components/Button';
const divStyle = css`
  padding: 20px 26px 0px;
`;
const Leaderboard = () => {
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

        <IndividualLeaderboard userData={sampleUserData} />
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
    </div>
  );
};

export default Leaderboard;

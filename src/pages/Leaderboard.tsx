/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import IndividualLeaderboard from '../components/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
import { sampleUserData } from 'sampleUserData';
import { UserRow } from 'components/UserRow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { reset } from 'reducers/counterReducer';
import { useHistory } from 'react-router';

const divStyle = css`
  padding: 20px 26px 0px;
`;

const Leaderboard = () => {
  const { pop } = useNavigator();
  const history = useHistory();

  const { score } = useSelector((state: RootState) => ({
    score: state.counterReducer.score,
  }));

  // useDispatch to dispatch actions
  const dispatch = useDispatch();
  const onReset = () => dispatch(reset());

  const handlePlayAgain = async () => {
    onReset();
    pop(1);
    history.goBack();
  };
  // Data from backend
  const currentUserData = {
    rank: 123,
    nickname: 'Jason',
    profileImage: null,
    totalScore: 323 + score,
  };

  return (
    <div>
      <ScreenHelmet title="리더보드" appendRight={<AppEjectionButton />} />
      <div css={divStyle}>
        <h1 css={largeTextStyle}>
          <span css={emphasizedTextStyle}>Jason</span>님은 <br />
          우리동네에서 <span css={emphasizedTextStyle}>121위</span> 에요!
        </h1>
        <UserRow
          currentUser={true}
          rank={currentUserData.rank}
          nickname={currentUserData.nickname}
          profileImage={currentUserData.profileImage}
          score={currentUserData.totalScore}
        />
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
            color={`secondary`}
            position={null}
            text={`다시하기`}
            onClick={handlePlayAgain}
          />
          <Button
            size={`medium`}
            color={`primary`}
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

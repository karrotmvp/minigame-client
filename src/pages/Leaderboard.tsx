/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigator } from '@karrotframe/navigator';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
import { sampleUserData } from 'sampleUserData';
import { UserRow } from 'components/leaderboard/UserRow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { reset } from 'reducers/counterReducer';

const divStyle = css`
  padding: 20px 26px 0px;
`;

const customNav = css`
  left: 0;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;

const custonNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;

const Leaderboard = () => {
  const { push } = useNavigator();

  const { score } = useSelector((state: RootState) => ({
    score: state.counterReducer.score,
  }));

  // useDispatch to dispatch actions
  const dispatch = useDispatch();
  const onReset = () => dispatch(reset());

  const handlePlayAgain = async () => {
    onReset();
    await push('/game');
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
      <div css={customNav}>
        <div css={custonNavIcon}>
          <AppEjectionButton />
        </div>
      </div>

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
            text={`다시하기`}
            onClick={handlePlayAgain}
          />
          <Button
            size={`medium`}
            color={`primary`}
            text={`자랑하기`}
            onClick={handlePlayAgain}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

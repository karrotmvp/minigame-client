/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import IconClose from 'assets/IconClose';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import BackendService from 'services/backendService';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';

const divStyle = css`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const headingWrapper = css`
  flex: 1;
  padding: 20px 26px 20px; ;
`;

const leaderboardWrapper = css`
  overflow: auto;
  padding: 0 26px;
`;
const actionItemWrapper = css`
  display: flex;
  justify-content: center;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const currentuserDataInfoRow = css`
  margin: 20px 0 10px;
`;

// interface userDataDataType {
//   nickname: string;
//   comment?: string;
//   rank?: number;
//   score?: number;
//   town: object;
// }
const Home = ({ userData }: any) => {
  const [townRankData, setTownRankData] = useState<[]>([]);
  console.log(userData);
  const { push } = useNavigator();

  const handleGameStart = () => {
    push(`/game`);
  };

  const { nickname, score } = useSelector((state: RootState) => ({
    nickname: state.userDataReducer.nickname,
    score: state.userDataReducer.score,
  }));

  console.log(nickname, score);
  let townId = `9bdfe83b68f3`;
  const getTownRank = async () => {
    try {
      const response = await BackendService.getTownRank(townId);
      const responseData: any = response.data[`data`];
      const indexedTownRankData = responseData.map((item: any, index: any) => ({
        rank: index + 1,
        ...item,
      }));
      setTownRankData(indexedTownRankData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getTownRank();
    console.log(townRankData);
  }, []);
  return (
    <>
      <ScreenHelmet title="홈" customCloseButton={<IconClose />} />
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{nickname}</span>님은
            <br />
            우리동네에서
            <span css={emphasizedTextStyle}>{userData.rank}위</span>에요!
          </h1>
          <div css={currentuserDataInfoRow}>
            {userData.rank <= 10 ? (
              <TopUserRow
                rank={userData.rank}
                nickname={nickname}
                score={score}
                comment={userData.comment}
              />
            ) : (
              <DefaultUserRow
                rank={userData.rank}
                nickname={nickname}
                score={score}
              />
            )}
          </div>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard townRankData={townRankData} />
        </div>
        <div css={actionItemWrapper}>
          <Button
            size={`large`}
            color={`primary`}
            text={`시작하기`}
            onClick={handleGameStart}
          />
        </div>
      </div>
    </>
  );
};

export default Home;

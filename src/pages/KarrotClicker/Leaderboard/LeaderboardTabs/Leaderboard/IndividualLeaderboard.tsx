/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { RefreshButton } from 'components/Button';
import { DefaultUserRow, TopUserRow } from '../Row';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { useAnalytics } from 'services/analytics';
import { WeeklyCountdown } from 'components/Timer';

export const IndividualLeaderboard: React.FC = () => {
  const analytics = useAnalytics();
  const [individualRankData, setIndividualRankData] = useState<any[]>([]);
  const minigameApi = useMinigameApi();
  const { gameType, updateMyKarrotClickerData } = useMyKarrotClickerData();

  const updateMyData = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
      if (data) {
        if (data.score && data.rank) {
          updateMyKarrotClickerData(data.score, data.rank);
        }
      }
      console.log('update my data');
    } catch (error) {
      console.log('no access token');
      console.error(error);
    }

    //
  }, [gameType, minigameApi.gameUserApi, updateMyKarrotClickerData]);
  const updateIndividualLeaderboard = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(gameType);
      if (data) {
        const indexedindividualRankData = data.map(
          (item: any, index: number) => ({
            rank: index + 1,
            ...item,
          })
        );
        setIndividualRankData(() => indexedindividualRankData);
        console.log(indexedindividualRankData);
      }
      //
      console.log('update individual leaderboard');
    } catch (error) {
      console.error(error);
    }
  }, [gameType, minigameApi.gameUserApi]);

  const refreshLeaderboard = useCallback(() => {
    analytics.logEvent('click_refresh_button', {
      game_type: 'karrot_clicker',
      button_type: 'user_leaderboard',
    });
    updateMyData();
    updateIndividualLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshLeaderboard();
    console.log('leaderboard refreshed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div css={divStyle}>
      <Refresh>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '4px',
          }}
        >
          <p>
            이번 주 랭킹&nbsp;&nbsp;
            <span>
              | 초기화 까지
              <span>
                <WeeklyCountdown />
              </span>
            </span>
          </p>
        </div>
        <RefreshButton handleRefresh={refreshLeaderboard} />
      </Refresh>

      <LeaderboardWrapper>
        {individualRankData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
              districtName={user.town.name2}
            />
          );
        })}
        <p css={infoText}>
          🎉 TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </p>
        {individualRankData.slice(10).map((user) => {
          return (
            <DefaultUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              score={user.score}
              districtName={user.town.name2}
            />
          );
        })}
      </LeaderboardWrapper>
    </div>
  );
};

const divStyle = css`
  // max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Refresh = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  margin: 14px 2px 12px 0;
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #5b5b5b;

    span {
      font-size: 10px;
      line-height: 161.7%;
      font-style: normal;
      font-weight: normal;
      /* or 16px */

      color: #5b5b5b;
      span {
        color: #eb5d0e;
      }
    }
  }
`;
const LeaderboardWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;

  // Hide scrollbar but keep functionality
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const infoText = css`
  margin: 17px 0 17px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* or 26px */

  text-align: center;

  color: #7c7c7c;
`;

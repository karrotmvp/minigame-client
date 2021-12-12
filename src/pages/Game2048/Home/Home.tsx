import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { rem } from 'polished';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
import {
  useLeaderboard,
  useMini,
  useUser,
  useMyGameData,
  useAccessToken,
} from 'hooks';
import type { TownLeaderboardType } from 'hooks';
import { Button } from 'components/Button';
import { Nav } from 'components/Navigation/Nav';
import { ReactComponent as IconArrowBack } from 'assets/icon/svg/icon_arrow_back.svg';
import { MemoizedLeaderboardTabs as LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { MemoizedRefresh as Refresh } from '../Leaderboard/Refresh';
import { MemoizedMyInfo as MyInfo, NotLoggedIn } from '../Leaderboard/MyInfo';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { useMyGame2048Data } from '../hooks';
import { useThrottledCallback } from 'use-debounce/lib';
import { navHeight, PageContainer, pageHeight } from 'styles';
import ReactModal from 'react-modal';
import { CommentModal } from './Modal';
import '@karrotframe/pulltorefresh/index.css';
import { PullToRefresh } from '@karrotframe/pulltorefresh';
import { css } from '@emotion/css';

export const Home: React.FC = () => {
  const { isTop } = useCurrentScreen();
  const { push, pop } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  const { isInWebEnvironment, handleThirdPartyAgreement } = useMini();
  const { town } = useUser();
  const { rank, gameType } = useMyGame2048Data();
  const { townLeaderboard, userLeaderboard, updateLeaderboard } =
    useLeaderboard();
  const { updateMyGameData } = useMyGameData();
  const [isRanked, setIsRanked] = useState<boolean>(false);
  const [myTownData, setMyTownData] = useState<{
    rank: number | undefined;
    score: number | undefined;
  }>({
    rank: undefined,
    score: undefined,
  });
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);

  const goToPlatformPage = () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: '2048_puzzle',
      location: 'home_page',
    });
    pop();
  };
  const goToGamePage = () => {
    // resetGame();
    push(`/game-2048/game`);
  };

  // game start button handler
  // =================================================================
  const addPlayerCount = async () => {
    try {
      const data = await minigameApi.gamePlayApi.playGameUsingPOST(gameType);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: '2048_puzzle',
      is_new_user: false,
    });
  };
  const onNewUserSuccessHandler = () => {
    // console.log('5');
    analytics.logEvent('click_third_party_agreement_button', {
      game_type: '2048_puzzle',
      button_type: 'game_start_button',
    });
    // console.log('6');
    addPlayerCount();
    // console.log('7');
    goToGamePage();
  };
  const handleNewUser = () => {
    // if user is new, open third-party agreement preset
    analytics.logEvent('click_game_start_button', {
      game_type: '2048_puzzle',
      is_new_user: true,
    });
    handleThirdPartyAgreement(onNewUserSuccessHandler);
  };

  const handleGameStart = () => {
    // bypass in web environment
    if (isInWebEnvironment) {
      goToGamePage();
      return;
    }
    if (accessToken) {
      handleReturningUser();
      goToGamePage();
      addPlayerCount();
    } else {
      handleNewUser();
    }
  };

  const updateMyTownData = useCallback(
    ({
      townLeaderboard,
      myTownId,
    }: {
      townLeaderboard: TownLeaderboardType[];
      myTownId: string;
    }) => {
      const myTown = townLeaderboard.find((town) => town.townId === myTownId);
      setMyTownData({
        rank: myTown?.rank,
        score: myTown?.score,
      });
    },
    []
  );

  // refresh leaderboard
  const handleRefresh = useCallback(async () => {
    if (isRanked) {
      const response = await updateMyGameData({ gameType: gameType });
      if (response === 'success') {
        const leaderboard = await updateLeaderboard({
          gameType: 'GAME_2048',
          size: 1000,
        });
        updateMyTownData({
          townLeaderboard: leaderboard?.townLeaderboard!,
          myTownId: town.id!,
        });
        return;
      }
    } else {
      const leaderboard = await updateLeaderboard({
        gameType: 'GAME_2048',
        size: 1000,
      });
      updateMyTownData({
        townLeaderboard: leaderboard?.townLeaderboard!,
        myTownId: town.id!,
      });
    }
  }, [
    gameType,
    isRanked,
    town.id,
    updateLeaderboard,
    updateMyGameData,
    updateMyTownData,
  ]);

  // Throttle refresh for 5 seconds
  const throttledRefresh = useThrottledCallback(handleRefresh, 3000);

  useEffect(() => {
    if (isTop) {
      handleRefresh();
    }
    if (rank !== 0) {
      setIsRanked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop]);

  // const [shouldSticky, setShouldSticky] = useState(false);

  const onScroll = (e: any) => {
    const offsetY = e.target.scrollTop;
    const limit = 205;
    if (limit < offsetY) {
      // setShouldSticky(true);
      // disable();
    } else {
      // setShouldSticky(false);
      // enable();
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_home_page', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexFlow: `column`,
          background: `linear-gradient(180deg, #82b6ff 180px, #fff 0)`,
        }}
      >
        <div
          style={{
            height: `calc(100vh - 90px)`,
            overflow: `hidden`,
            overscrollBehavior: `contain`,
            background: `transparent`,
          }}
        >
          <Nav
            appendLeft={<IconArrowBack />}
            onClickLeft={goToPlatformPage}
            appendCenter={
              <>
                <p
                  style={{
                    fontWeight: `bold`,
                    fontSize: `${rem(16)}`,
                    color: '#FFFFFF',
                    marginBottom: `4px`,
                  }}
                >
                  이번주 랭킹
                </p>
                <Refresh />
              </>
            }
            appendRight={<button>초대하기</button>}
            style={{ backgroundColor: 'transparent' }}
          />

          <PageContainer
            id="home-page__2048-puzzle"
            onScroll={onScroll}
            style={{
              height: `100%`,
              overflow: `auto`,
              background: `transparent`,
              position: 'relative',
            }}
          >
            <PullToRefresh
              onPull={(dispose) => {
                handleRefresh().then(() => {
                  dispose();
                });
              }}
              className={css`
                --kf_pulltorefresh_backgroundColor: transparent;
                --kf_pulltorefresh_backgroundLowColor: transparent;
                --kf_pulltorefresh_fallbackSpinner-color: #ffffff;
              `}
            >
              <Top className="top">
                <div className="top__my-info">
                  {true ? (
                    <MyInfo
                      myTownRank={myTownData.rank as number}
                      myTownScore={myTownData.score as number}
                      setIsCommentModalOpen={setIsCommentModalOpen}
                    />
                  ) : (
                    <NotLoggedIn
                      myTownRank={myTownData.rank as number}
                      myTownScore={myTownData.score as number}
                    />
                  )}
                </div>
              </Top>
              <Bottom className="bottom">
                <LeaderboardTabs
                  townLeaderboard={townLeaderboard}
                  userLeaderboard={userLeaderboard}
                  isRanked={isRanked}
                />
              </Bottom>
            </PullToRefresh>
          </PageContainer>
        </div>
        <ActionItem>
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              right: '24px',
              zIndex: 101,
            }}
          >
            <ActiveUserCount gameType="GAME_2048" />
          </div>
          <Button
            size={`large`}
            fontSize={rem(20)}
            color={`primary`}
            onClick={handleGameStart}
          >
            게임 시작
          </Button>
        </ActionItem>
      </div>

      <ReactModal
        isOpen={isCommentModalOpen}
        contentLabel="2048-puzzle-comment-modal"
        style={{
          overlay: {
            zIndex: 100,
            background: 'rgba(40, 40, 40, 0.9)',
            backdropFilter: `blur(5px)`,
            WebkitBackdropFilter: `blur(5px)`,
          },
          content: {
            width: '100%',
            height: '100%',
            inset: '50% auto auto 50%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 'none',
            display: `flex`,
            flexFlow: `column`,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 'none',
          },
        }}
      >
        <CommentModal
          setIsCommentModalOpen={setIsCommentModalOpen}
          handleRefresh={handleRefresh}
        />
      </ReactModal>
    </>
  );
};

const Top = styled.div`
  width: 100%;
  // background: linear-gradient(180deg, #82b6ff 180px, #fff 0);
  position: relative;
  // top: -${navHeight};
  // padding-top: ${navHeight};

  div.top__my-info {
    padding: 0 20px;
  }
`;

const Bottom = styled.div`
  flex: 1;
  background: #fff;
  position: sticky;
  height: calc(${pageHeight} - 40px);
  top: ${navHeight};
`;

const ActionItem = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  padding: 15px 18px 30px;

  display: flex;
  justify-content: center;

  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

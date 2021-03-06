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
  useAccessToken,
  UserLeaderboardType,
} from 'hooks';
import type { TownLeaderboardType } from 'hooks';
import { Button } from 'components/Button';
import { Nav } from 'components/Navigation/Nav';
import { ReactComponent as IconCloseCircle } from 'assets/icon/svg/icon_close_circle.svg';

import { ReactComponent as IconArrowBack } from 'assets/icon/svg/icon_arrow_back.svg';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { MemoizedRefresh as Refresh } from '../Leaderboard/Refresh';
import {
  MemoizedUserLoggedIn as UserLoggedIn,
  UserNotLoggedIn,
} from '../Leaderboard/Highlight';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { useMyGame2048Data } from '../hooks';
// import { useThrottledCallback } from 'use-debounce/lib';
import { navHeight, PageContainer, pageHeight } from 'styles';
import ReactModal from 'react-modal';
import { CommentModal, Share } from './Modal';
import '@karrotframe/pulltorefresh/index.css';
import { PullToRefresh } from '@karrotframe/pulltorefresh';
import { css } from '@emotion/css';
import './home.scss';

export const Home: React.FC = () => {
  const { isTop } = useCurrentScreen();
  const { push, pop } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  const { isInWebEnvironment, handleThirdPartyAgreement } = useMini();
  const { user, town } = useUser();
  const { rank, gameType, updateMyScore, updateMyComment } =
    useMyGame2048Data();
  const {
    // townLeaderboard,
    // userLeaderboard,
    getUserLeaderboard,
    getTownLeaderboard,
  } = useLeaderboard();
  const [townLeaderboard, setTownLeaderboard] = useState<TownLeaderboardType[]>(
    []
  );
  const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardType[]>(
    []
  );
  const [isFirstInTown, setIsFirstInTown] = useState<boolean>(false);
  const [isRanked, setIsRanked] = useState<boolean>(
    user.userId !== undefined || user.userId !== '' ? false : true
  );
  const [myTownData, setMyTownData] = useState<{
    rank: number | undefined;
    score: number | undefined;
  }>({
    rank: undefined,
    score: undefined,
  });
  const [myData, setMyData] = useState<{
    rank: number | undefined;
    score: number | undefined;
  }>({
    rank: undefined,
    score: undefined,
  });
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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

  // const getMyGameData = useCallback(
  //   async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
  //     const {
  //       data: { data },
  //     } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
  //     console.log('2', data);
  //     if (data) {
  //       console.log('2-1', data);
  //       if (data.score && data.rank) {
  //         console.log('2-1', data.score, data.rank);
  //         updateMyScore({
  //           score: data.score,
  //           rank: data.rank,
  //         });
  //         if (data.comment) {
  //           updateMyComment(data.comment);
  //         }

  //         return data;
  //       }
  //     }
  //     return undefined;
  //   },
  //   [minigameApi.gameUserApi, updateMyComment, updateMyScore]
  // );

  const getMyGameData = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);

      return data;
    },
    [minigameApi.gameUserApi]
  );
  const updateMyGameData = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      getMyGameData({ gameType }).then((response) => {
        if (response) {
          updateMyScore({
            score: response.score,
            rank: response.rank,
          });
          if (response.comment) {
            updateMyComment(response.comment);
          }

          setMyData({
            rank: response.rank,
            score: response.score,
          });
        }
      });
    },
    [getMyGameData, updateMyComment, updateMyScore]
  );

  const updateMyTownData = useCallback(
    async ({
      townLeaderboard,
      myTownId,
    }: {
      townLeaderboard: TownLeaderboardType[] | null;
      myTownId: string;
    }) => {
      if (townLeaderboard) {
        const myTown = townLeaderboard.find((town) => {
          return town.townId === undefined
            ? undefined
            : town.townId === myTownId;
        });

        myTown === undefined
          ? setIsFirstInTown(true)
          : setMyTownData({
              rank: myTown?.rank,
              score: myTown?.score,
            });
      }
    },
    []
  );

  const updateLeaderboard = useCallback(
    ({
      gameType,
      size,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      size: number;
    }) => {
      getUserLeaderboard({ gameType, size }).then((response) => {
        if (response) setUserLeaderboard(response);
      });
      getTownLeaderboard({
        gameType,
      }).then((response) => {
        if (response) {
          setTownLeaderboard(response);
          updateMyTownData({
            townLeaderboard: response,
            myTownId: town.id!,
          });
        }
      });
    },
    [getTownLeaderboard, getUserLeaderboard, town.id, updateMyTownData]
  );
  // refresh leaderboard
  const handleRefresh = useCallback(
    async ({
      gameType,
      size,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      size: number;
    }) => {
      updateMyGameData({ gameType })
        .then(() => {
          updateLeaderboard({ gameType, size });
        })
        .catch((error) => {
          console.error(error);
          updateLeaderboard({ gameType, size });
        })
        .finally(() => {
          // updateLeaderboard({ gameType, size });
        });
    },
    [updateLeaderboard, updateMyGameData]
  );

  // Throttle refresh for 5 seconds
  // const throttledRefresh = useThrottledCallback(()=>handleRefresh, 3000);

  useEffect(() => {
    if (rank !== 0) {
      setIsRanked(true);
    }
  }, [rank]);
  useEffect(() => {
    if (isTop) {
      handleRefresh({ gameType: 'GAME_2048', size: 100 });
    }
  }, [handleRefresh, isTop]);

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
            style={{
              height: '80px',
              paddingTop: '36px',
              alignItems: 'flex-start',
              background: 'transparent',
            }}
            appendLeft={<IconArrowBack style={{ fill: '#fff' }} />}
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
                  ?????? ???
                </p>
                <Refresh />
              </>
            }
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
                handleRefresh({ gameType: 'GAME_2048', size: 100 }).then(() => {
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
                  {accessToken ? (
                    <UserLoggedIn
                      myRank={myData.rank}
                      myScore={myData.score}
                      myTownRank={myTownData.rank as number}
                      myTownScore={myTownData.score as number}
                      setIsCommentModalOpen={setIsCommentModalOpen}
                      setIsShareModalOpen={setIsShareModalOpen}
                    />
                  ) : (
                    <UserNotLoggedIn
                      myTownRank={myTownData.rank ? myTownData.rank : undefined}
                      myTownScore={
                        myTownData.score ? myTownData.score : undefined
                      }
                      isFirstInTown={isFirstInTown}
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
            ?????? ??????
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
          handleRefresh={async () =>
            handleRefresh({ gameType: 'GAME_2048', size: 100 })
          }
        />
      </ReactModal>

      <ReactModal
        isOpen={isShareModalOpen}
        contentLabel="2048-puzzle how to play"
        onRequestClose={() => setIsShareModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            background: 'rgba(90, 90, 90, 0.7)',
            backdropFilter: `blur(5px)`,
            WebkitBackdropFilter: `blur(5px)`,
            zIndex: 100,
          },
          content: {
            width: `100%`,
            height: '100%',
            inset: '50% auto auto 50%',
            // top: '50%',
            // left: '50%',
            // right: 'auto',
            // bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            display: `flex`,
            flexFlow: `column`,
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            boxSizing: `border-box`,

            background: 'transparent',

            position: 'relative',
          },
        }}
      >
        <button
          onClick={() => setIsShareModalOpen(false)}
          style={{
            position: `absolute`,
            top: '40px',
            right: '28px',
            zIndex: 9999,
          }}
        >
          <IconCloseCircle />
        </button>

        <Share setIsShareModalOpen={setIsShareModalOpen} isRanked={isRanked} />
      </ReactModal>
    </>
  );
};

const Top = styled.div`
  width: 100%;
  position: relative;
  margin-top: 25px;
  margin-bottom: 26px;
  div.top__my-info {
    padding: 0 16px;
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

// const ShareButton = styled.div`
//   height: 26px;
//   background: #4694ff;
//   border: none;
//   box-sizing: border-box;
//   border-radius: 6px;
//   padding: 4px 10px;
//   box-shadow: 0px 4px 0px 0px #0064ed;
//   position: relative;

//   p {
//     font-size: ${rem(12)};
//     line-height: 161.7%;
//     color: #fff;
//   }

//   &::before {
//     content: '';
//     background-image: url(${iconFriend});
//     background-size: cover;
//     background-repeat: no-repeat;
//     background-position: center center;
//     width: 40px;
//     height: 23px;
//     position: absolute;
//     top: -20px;
//     left: 0;
//     right: 0;
//     margin-left: auto;
//     margin-right: auto;
//     z-index: -1;
//   }
// `;

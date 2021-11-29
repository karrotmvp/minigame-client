import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMinigameApi } from 'services/api/minigameApi';
import { useAccessToken, useMini, useUserData } from 'hooks';
import { Nav } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';
import { rem } from 'polished';
import { useMyGame2048Data } from './Game2048/hooks';
import { useMyKarrotClickerData } from './KarrotClicker/hooks';
import { useAnalytics } from 'services/analytics';
import { color, PageContainer } from 'styles';
import newUrl from 'assets/svg/new.svg';
import BellUrl from 'assets/svg/bell.svg';
import Game2048CardImgUrl from 'assets/svg/game2048/game_2048_card_img.svg';
import KarrotClickerCardImgUrl from 'assets/svg/KarrotClicker/karrot_clicker_card_img.svg';
import WhatsNextCardImgUrl from 'assets/svg/whats_next_card_img.svg';
import ComingSoonCardImgUrl from 'assets/svg/coming_soon_card_img.svg';
import ArrowGame2048Url from 'assets/svg/arrow_game_2048.svg';
import ArrowKarrotClickerUrl from 'assets/svg/arrow_karrot_clicker.svg';
import { ReactComponent as Bookmark } from 'assets/svg/bookmark_icon.svg';
import { ReactComponent as BookmarkDone } from 'assets/svg/bookmark_done_icon.svg';
import { ReactComponent as Share } from 'assets/svg/share_icon.svg';
import { ReactComponent as Circle2048Puzzle } from 'assets/svg/circle_2048_puzzle.svg';
import { ReactComponent as CircleKarrotClicker } from 'assets/svg/circle_karrot_clicker.svg';
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import {
  SubscribeToastContainer,
  subscribeToastEmitter,
} from 'components/Toast';
import { useUser } from 'redux/user';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import { Autoplay } from 'swiper';
import { lastWeek } from 'utils/date';
import { DistrictName } from 'styles/leaderboard';

export const Home: React.FC = () => {
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { isTop } = useCurrentScreen();
  const { push } = useNavigator();
  const {
    isInWebEnvironment,
    ejectApp,
    handleThirdPartyAgreement,
    handleInstallation,
    shareApp,
  } = useMini();
  const { accessToken } = useAccessToken();
  const {
    userId,
    nickname,
    setUserInfo,
    townName3,
    isInstalled,
    isNewGameNotificationOn,
    setIsInstalled,
    setIsNewGameNotificationOn,
  } = useUserData();
  const {
    updateMyScore: updateMyGame2048Score,
    updateMyComment: updateMyGame2048Comment,
    setGameTypeToGame2048,
  } = useMyGame2048Data();
  const {
    updateMyKarrotClickerData,
    updateMyComment: updateMyKarrotClickerComment,
    setGameTypeToKarrotClicker,
  } = useMyKarrotClickerData();
  const { uuid, regionId, referer } = useUser();

  const leaveMiniApp = () => {
    analytics.logEvent('click_leave_mini_app_button');
    ejectApp();
  };

  // Page navigator
  const goToSurveyPage = () => {
    analytics.logEvent('click_survey_button');
    push(`/survey`);
  };
  const goToGame2048 = async () => {
    setGameTypeToGame2048();
    // bypass in web environment
    if (isInWebEnvironment) {
      push(`/game-2048`);
      return;
    }
    try {
      if (accessToken) {
        analytics.logEvent('click_game_enter_button', {
          game_type: '2048_puzzle',
          is_new_user: false,
        });
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_2048');
        if (data) {
          if (data.score && data.rank) {
            updateMyGame2048Score(data.score, data.rank);
          }
          if (data.comment) {
            updateMyGame2048Comment(data.comment);
          }
        }
        push(`/game-2048`);
      } else {
        analytics.logEvent('click_game_enter_button', {
          game_type: '2048_puzzle',
          is_new_user: true,
        });
        push(`/game-2048`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const goToKarrotClicker = async () => {
    setGameTypeToKarrotClicker();
    if (isInWebEnvironment) {
      push(`/karrot-clicker`);
      return;
    }
    try {
      if (accessToken) {
        analytics.logEvent('click_game_enter_button', {
          game_type: 'karrot_clicker',
          is_new_user: false,
        });
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
        if (data) {
          if (data.score && data.rank) {
            updateMyKarrotClickerData(data.score, data.rank);
          }
          if (data.comment) {
            updateMyKarrotClickerComment(data.comment);
          }
        }
        push(`/karrot-clicker`);
      } else {
        analytics.logEvent('click_game_enter_button', {
          game_type: 'karrot_clicker',
          is_new_user: true,
        });
        push(`/karrot-clicker`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Share handler
  // =================================================================
  const runShareOnSuccess = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      location: 'platform_page',
      button_type: 'share_button',
    });
    console.log('thirdpartyagreement success');
    handleShare();
  };
  const handleShare = () => {
    analytics.logEvent('click_share_button', {
      location: 'platform_page',
    });
    const url = 'https://daangn.onelink.me/HhUa/2da74f80';
    const text = `${nickname}님이 이웃님을 동네대회에 초대했어요! 같이 게임할래요?`;
    shareApp(url, text);
  };
  const triggerShareHandler = () => {
    if (accessToken) {
      handleShare();
    } else {
      handleThirdPartyAgreement(runShareOnSuccess);
    }
  };

  // Installation handler
  // =================================================================
  const onSubscribeSucess = () => {
    analytics.logEvent('click_subscribe_button', {
      location: 'platform_page',
      is_voluntary: true,
    });
    setIsInstalled(true);
    subscribeToastEmitter();
  };
  const runOnSuccess = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      location: 'platform_page',
      button_type: 'subscribe_button',
    });
    handleInstallation(onSubscribeSucess);
  };
  const triggerInstallationHandler = () => {
    if (accessToken) {
      handleInstallation(onSubscribeSucess);
    } else {
      handleThirdPartyAgreement(runOnSuccess);
    }
  };

  // New game notification handler
  // =================================================================
  const onSuccessHandler = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      location: 'platform_page',
      button_type: 'notification_button',
    });
    setIsNewGameNotificationOn(true);
  };
  const handleNewGameNotification = async () => {
    if (accessToken) {
      const { data } =
        await minigameApi.notificationApi.saveNotificationUsingPOST({
          type: 'OPEN_GAME' as NotificationRequestDtoTypeEnum,
        });
      if (data.status === 200) {
        analytics.logEvent('click_notification_button', {
          notification_type: 'new_game',
        });
        setIsNewGameNotificationOn(true);
      }
    } else {
      handleThirdPartyAgreement(onSuccessHandler);
    }
  };
  const checkNotificationStatus = useCallback(async () => {
    if (isNewGameNotificationOn) {
      return;
    } else {
      try {
        const {
          data: { data },
        } = await minigameApi.notificationApi.checkNotificationUsingGET(
          'OPEN_GAME'
        );
        if (data && data.check) {
          setIsNewGameNotificationOn(data.check);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    isNewGameNotificationOn,
    minigameApi.notificationApi,
    setIsNewGameNotificationOn,
  ]);

  // Update user info
  const updateUserInfo = useCallback(
    async ({ userId }: { userId: string }) => {
      if (userId) {
        return;
      } else {
        try {
          const {
            data: { data },
          } = await minigameApi.userApi.getUserInfoUsingGET();
          if (data) {
            setUserInfo(data.id, data.nickname);
            // FA: track user with set user id
            // analytics.setUserId(data.id);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [minigameApi.userApi, setUserInfo]
  );

  // Track user with uuid
  const trackUser = useCallback(
    async ({
      uUID,
      regionId,
      referer,
    }: {
      uUID: string;
      regionId: string;
      referer?:
        | 'FEED'
        | 'NEAR_BY'
        | 'UNKNOWN'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM';
    }) => {
      try {
        analytics.setUserId(uuid);
        const data = await minigameApi.visitorApi.visitUsingPOST(
          uUID,
          regionId,
          referer
        );
        console.log('trackuser', data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [analytics, minigameApi.visitorApi, uuid]
  );

  useEffect(() => {
    trackUser({ uUID: uuid, regionId: regionId, referer: referer });
  }, [referer, regionId, trackUser, uuid]);

  useEffect(() => {
    updateUserInfo({ userId: userId });
    checkNotificationStatus();
  }, [checkNotificationStatus, updateUserInfo, userId]);

  // Last week Top 10 Comments Carousel
  const [top2048PuzzleUsers, setTop2048PuzzleUsers] = useState<any[]>();
  const [topKarrotClickerUsers, setTopKarrotClickerUsers] = useState<any[]>();

  const getLastWeekTopUsers = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      try {
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
          gameType,
          lastWeek.month,
          10,
          lastWeek.week,
          lastWeek.year
        );
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi.gameUserApi]
  );

  const retreieveTop2048PuzzleUsers = useCallback(async () => {
    const response = await getLastWeekTopUsers({
      gameType: 'GAME_2048',
    });
    const indexedResponse2048Puzzle = response?.map(
      (item: any, index: number) => ({
        ...item,
        rank: index + 1,
        town: {
          ...item.town,
          name1: item.town.name1.replace(
            /(특별시|광역시|특별자치시|특별자치도)$/,
            ''
          ),
        },
      })
    );
    setTop2048PuzzleUsers(indexedResponse2048Puzzle);
  }, [getLastWeekTopUsers]);

  const retrieveTopKarrotClickerUsers = useCallback(async () => {
    const response = await getLastWeekTopUsers({
      gameType: 'GAME_KARROT',
    });
    const indexedResponseKarrotClicker = response?.map(
      (item: any, index: number) => ({
        ...item,
        rank: index + 1,
        town: {
          ...item.town,
          name1: item.town.name1.replace(
            /(특별시|광역시|특별자치시|특별자치도)$/,
            ''
          ),
        },
      })
    );
    setTopKarrotClickerUsers(indexedResponseKarrotClicker);
  }, [getLastWeekTopUsers]);

  useEffect(() => {
    if (isTop) {
      retreieveTop2048PuzzleUsers();
      retrieveTopKarrotClickerUsers();
    }
  }, [isTop, retreieveTop2048PuzzleUsers, retrieveTopKarrotClickerUsers]);

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_platform_page');
    }
  }, [analytics, isTop]);

  return (
    <>
      <Nav
        border={`1px solid #ECECEC`}
        appendLeft={<CloseIcon />}
        onClickLeft={leaveMiniApp}
        appendRight={
          <div
            style={{
              display: `flex`,
              gap: `14px`,
              alignItems: `flex-end`,
            }}
          >
            <Share onClick={triggerShareHandler} />
            {isInstalled ? (
              <BookmarkDone />
            ) : (
              <Bookmark onClick={triggerInstallationHandler} />
            )}
          </div>
        }
        style={{
          background: `#fff`,
        }}
      />
      <PageContainer id="platform-page">
        <Section>
          <MainText>
            <span>{townName3}</span> 이웃들과
            <br />
            같이 게임해요!
          </MainText>
          <CardContainer className="container--games">
            <Card game={`game-2048`} onClick={goToGame2048}>
              <img
                src={Game2048CardImgUrl}
                alt="2048-puzzle-enter-button"
                style={{
                  width: `${rem(80)}`,
                  height: `${rem(115)}`,
                  bottom: `10px`,
                  left: `0`,
                }}
              />
              <h3>
                2048 퍼즐
                <img
                  src={newUrl}
                  alt=""
                  style={{
                    display: 'inline-box',
                    marginLeft: '5px',
                  }}
                />
              </h3>
              <p>
                동네 천재 타이틀을 원한다면?
                <br />
                중독성 갑 퍼즐 게임
              </p>
              <ActionButton src={ArrowGame2048Url} />
            </Card>
            <Card game={`karrot-clicker`} onClick={goToKarrotClicker}>
              <img
                src={KarrotClickerCardImgUrl}
                alt="karrot-clicker-enter-button"
                style={{
                  width: `${rem(60)}`,
                  height: `${rem(130)}`,
                  bottom: `0`,
                  left: `23px`,
                }}
              />
              <h3>당근모아</h3>
              <p>
                한 번 누르면 멈추기 어려운
                <br />
                귀여운 클리커 게임
              </p>
              <ActionButton src={ArrowKarrotClickerUrl} />
            </Card>
          </CardContainer>
        </Section>
        <Break />
        <Section>
          <SectionTitle style={{ marginBottom: `10px` }}>
            지난주 전국 Top 10의 한 마디
          </SectionTitle>
          <p
            style={{
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: `${rem(12)}`,
              lineHeight: `161.7%`,
              color: `#9F9F9F`,
              marginBottom: `20px`,
            }}
          >
            Top 10에 들면 이웃들에게 한 마디 외칠 수 있어요
          </p>
          <LastWeekTopComments>
            <div className="game">
              <Circle2048Puzzle />
              <div className="comment-bubble">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={30}
                  centeredSlides={true}
                  initialSlide={1}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  className="mySwiper"
                >
                  {top2048PuzzleUsers?.map((user, i) => {
                    if (user.comment === '' || user.comment === null) {
                      user.comment = `${user.town.name2} 파이팅!`;
                    }
                    return (
                      <SwiperSlide key={i}>
                        <TopUserContent>
                          <div className="user-info">
                            <p
                              style={{
                                color: `#0E74FF`,
                              }}
                            >
                              {user.rank}등 {user.nickname}
                            </p>
                            <DistrictName color={`#0E74FF`}>
                              {user.town.name1}&nbsp;{user.town.name2}
                            </DistrictName>
                          </div>
                          <p className="comment">{user.comment}</p>
                        </TopUserContent>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
            <div className="game">
              <CircleKarrotClicker />
              <div className="comment-bubble">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={30}
                  centeredSlides={true}
                  initialSlide={1}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  className="mySwiper"
                >
                  {topKarrotClickerUsers?.map((user, i) => {
                    if (user.comment === '' || user.comment === null) {
                      user.comment = `${user.town.name2} 파이팅!`;
                    }
                    return (
                      <SwiperSlide key={i}>
                        <TopUserContent>
                          <div className="user-info">
                            <p
                              style={{
                                color: `#EB5D0E`,
                              }}
                            >
                              {user.rank}등 {user.nickname}
                            </p>
                            <DistrictName color={`#EB5D0E`}>
                              {user.town.name1}&nbsp;{user.town.name2}
                            </DistrictName>
                          </div>
                          <p className="comment">{user.comment}</p>
                        </TopUserContent>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </LastWeekTopComments>
        </Section>
        <Break
          style={{
            margin: `24px 0 22px`,
          }}
        />
        <Section>
          <SectionTitle>새로운 게임을 준비 중이에요</SectionTitle>
          <CardContainer>
            {isNewGameNotificationOn ? (
              <Card game={`coming-soon`}>
                <img
                  src={ComingSoonCardImgUrl}
                  alt="coming-soon-button"
                  style={{
                    width: `${rem(71)}`,
                    height: `${rem(93)}`,
                    bottom: `-3px`,
                    left: `15px`,
                  }}
                />
                <h3>Coming Soon</h3>
                <p>
                  오픈 알림 신청 완료!
                  <br />
                  새로운 게임이 열리면 알려드릴게요
                </p>
              </Card>
            ) : (
              <Card
                game={`whats-next`}
                onClick={handleNewGameNotification}
                style={{
                  border: `1px solid #ECECEC`,
                }}
              >
                <img
                  src={WhatsNextCardImgUrl}
                  alt="whats-next"
                  style={{
                    width: `${rem(71)}`,
                    height: `${rem(93)}`,
                    bottom: `-3px`,
                    left: `15px`,
                  }}
                />
                <h3>What's Next?</h3>
                <p>
                  <span>오픈 알림</span>을 신청하면
                  <br />
                  빠르게 대회에 참여할 수 있어요!
                </p>
                <ActionButton src={BellUrl} />
              </Card>
            )}
          </CardContainer>
        </Section>
        <Break />
        <Section>
          <SectionTitle>하고 싶은 게임이 있나요?</SectionTitle>
          <GameSurvey>
            <ModalOpenButton onClick={goToSurveyPage}>
              <p className="left-text">예) 테트리스</p>
              <p className="right-text">보내기</p>
            </ModalOpenButton>
          </GameSurvey>
        </Section>
      </PageContainer>
      <SubscribeToastContainer />
    </>
  );
};

const Section = styled.div`
  padding: 0 ${rem(20)};
`;
const Break = styled.div`
  background: #f8f8f8;
  min-height: 6px;
  height: 6px;
  margin: 30px 0 22px;
`;

const MainText = styled.div`
  color: #3f3f3f;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 162.7%;
  margin: 20px 0 30px;
  span {
    color: #0e74ff;
    font-size: ${rem(34)};
  }
`;
const SectionTitle = styled.h3`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(20)};
  line-height: 121.2%;
  /* or 24px */
  color: #3f3f3f;
  margin-bottom: 15px;
`;
const CardContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${rem(30)};
`;
const Card = styled.a<{ game: string }>`
  position: relative;

  width: 100%;
  padding: ${rem(18)} 0;
  border: none;
  border-radius: 10px;

  background-color: ${(props) =>
    props.game === `game-2048`
      ? `${color.blue400}`
      : props.game === `karrot-clicker`
      ? `${color.orange}`
      : props.game === `whats-next`
      ? `${color.gray50}`
      : props.game === `coming-soon`
      ? `#efefef`
      : `efefef`};

  box-shadow: ${(props) =>
    props.game === `game-2048`
      ? `0px 8px 0px 0px #0D5AC4`
      : props.game === `karrot-clicker`
      ? `0px 8px 0px 0px #D96726`
      : props.game === `whats-next`
      ? `0px 8px 0px 0px #E5E5E5`
      : `0px 0px 0px 0px #fff`};

  img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
  }

  h3 {
    font-weight: bold;
    font-size: ${rem(24)};
    line-height: 161.7%;
    /* or 39px */
    margin: 0 ${rem(50)} 0 ${rem(105)};
    color: ${(props) =>
      props.game === `whats-next`
        ? `${color.orange}`
        : props.game === `coming-soon`
        ? `${color.gray300}`
        : `${color.white}`};

    font-family: ${(props) =>
      props.game === `game-2048` || props.game === `karrot-clicker`
        ? `Cafe24Ssurround`
        : `Pretendard`};
  }

  p {
    font-weight: normal;
    font-size: ${rem(12)};
    line-height: 161.7%;
    /* or 19px */
    margin-left: ${rem(105)};

    color: ${(props) =>
      props.game === `whats-next`
        ? `${color.gray300}`
        : props.game === `coming-soon`
        ? `${color.gray300}`
        : `${color.white}`};

    span {
      font-size: inherit;
      color: ${(props) =>
        props.game === `whats-next` ? `${color.orange}` : `inherit`};
    }
  }
`;

const ActionButton = styled.img`
  position: absolute;
  top: 24px;
  right: 22px;
  height: 25px;
  width: 25px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
`;

const LastWeekTopComments = styled.div`
  display: flex;
  flex-flow: column;
  gap: 15px;

  div.game {
    display: flex;
    flex-flow: row;
    gap: 20px;

    div.comment-bubble {
      flex: 1;
      width: 100px;
      display: flex;
      justify-content: center;
      position: relative;
      background: #f5f5f5;
      border-radius: 10px;
      padding: 10px 13px;
      &:after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 7px 10px 7px 0;
        border-color: transparent #f5f5f5;
        display: block;
        width: 0;
        z-index: 1;
        margin-top: -7px;
        left: -8px;
        top: 50%;
      }
    }
  }
`;

const TopUserContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  div.user-info {
    display: flex;
    flex-direction: row;
    gap: 5px;

    p {
      font-style: normal;
      font-weight: bold;
      font-size: ${rem(12)};
      line-height: 161.7%;
      word-spacing: 5px;
    }
  }

  p.comment {
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(14)};
    line-height: 161.7%;
    color: #5b5b5b;
  }
`;

const GameSurvey = styled.div`
  padding-bottom: 44px;
`;
const ModalOpenButton = styled.button`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  width: 100%;

  padding: 10px 20px;

  p.left-text {
    font-family: Pretendard;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #a9a9a9;
  }
  p.right-text {
    font-family: Pretendard;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 121.2%;
    /* identical to box height, or 15px */

    /* blue/blue 400 */

    color: #0e74ff;
  }
`;

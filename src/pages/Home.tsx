import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMinigameApi } from 'services/api/minigameApi';
import { useAccessToken, useMini, useUserData } from 'hooks';
import { Nav, navHeight } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';
import { rem } from 'polished';
import { useMyGame2048Data } from './Game2048/hooks';
import { useMyKarrotClickerData } from './KarrotClicker/hooks';
import { useAnalytics } from 'services/analytics';
import { color } from 'styles';
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
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import {
  SubscribeToastContainer,
  subscribeToastEmitter,
} from 'components/Toast';

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
    regionId,
    townId,
    townName1,
    townName2,
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

  const leaveMiniApp = () => {
    analytics.logEvent('click_leave_mini_app_button');
    ejectApp();
  };

  const goToSurveyPage = () => {
    push(`/survey`);
  };
  const goToGame2048 = async () => {
    setGameTypeToGame2048();
    // bypass in web environment
    if (isInWebEnvironment) {
      console.log('bypass in web environment: main to game-2048');
      push(`/game-2048`);
      return;
    }
    try {
      if (accessToken) {
        analytics.logEvent('click_game_enter_button', {
          game_type: 'game-2048',
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
          game_type: 'game-2048',
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
      console.log('bypass in web environment: main to karrot-clicker');
      push(`/karrot-clicker`);
      return;
    }
    try {
      if (accessToken) {
        analytics.logEvent('click_game_enter_button', {
          game_type: 'karrot-clicker',
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
          game_type: 'karrot-clicker',
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
  const triggerShareHandler = () => {
    console.log('trigger share handler');
    const url = 'https://daangn.onelink.me/HhUa/3a219555';
    const text = `동네대회를 플레이 하고 이웃들에게 한 마디를 남겨보세요!`;
    if (accessToken) {
      shareApp(url, text);
      analytics.logEvent('click_share_button', {
        location: 'platform_page',
      });
    } else {
      handleThirdPartyAgreement(() => {
        shareApp(url, text);
        analytics.logEvent('click_share_button', {
          location: 'platform_page',
        });
      });
    }
  };

  // Installation handler
  // =================================================================
  const onInstallationSuccess = () => {
    setIsInstalled(true);
    subscribeToastEmitter();
  };
  const triggerInstallationHandler = () => {
    console.log('trigger installation handler');
    analytics.logEvent('click_subscribe_button', {
      location: 'platform_page',
      is_voluntary: true,
    });
    if (accessToken) {
      handleInstallation(onInstallationSuccess);
    } else {
      handleThirdPartyAgreement(() => {
        handleInstallation(onInstallationSuccess);
      });
    }
  };

  // New game notification handler
  // =================================================================
  const handleNewGameNotification = async () => {
    if (accessToken) {
      const { data } =
        await minigameApi.notificationApi.saveNotificationUsingPOST({
          type: 'OPEN_GAME' as NotificationRequestDtoTypeEnum,
        });
      if (data.status === 200) {
        console.log('notification (game) success');
        setIsNewGameNotificationOn(true);
      }
    } else {
      handleThirdPartyAgreement(() => setIsNewGameNotificationOn(true));
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

  useEffect(() => {
    if (isTop) {
      checkNotificationStatus();
    }
  }, [checkNotificationStatus, isTop]);

  // =================================================================

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

      <Page className="game-platform-page">
        <MainText>
          <span>{townName3}</span> 이웃들과
          <br />
          같이 게임해요!
        </MainText>
        <CardContainer className="container--games">
          <Card game={`game-2048`} onClick={goToGame2048}>
            <CardImg1 src={Game2048CardImgUrl} />

            <Title>
              퍼즐 2048
              <img
                src={newUrl}
                alt=""
                style={{
                  display: 'inline-box',
                  marginLeft: '5px',
                }}
              />
            </Title>

            <Text>
              동네 천재 타이틀을 원한다면?
              <br />
              중독성 갑 퍼즐 게임
            </Text>
            <ActionButton src={ArrowGame2048Url} />
          </Card>
          <Card game={`karrot-clicker`} onClick={goToKarrotClicker}>
            <CardImg2 src={KarrotClickerCardImgUrl} />
            <Title>당근모아</Title>
            <Text>
              한 번 누르면 멈추기 어려운
              <br />
              귀여운 클리커 게임
            </Text>
            <ActionButton src={ArrowKarrotClickerUrl} />
          </Card>
        </CardContainer>
        <Break />
        <SectionTitle style={{ marginBottom: `15px` }}>
          새로운 게임을 준비 중이에요
        </SectionTitle>
        <CardContainer>
          {isNewGameNotificationOn ? (
            <Card game={`coming-soon`}>
              <CardImg3 src={ComingSoonCardImgUrl} />
              <Title>Coming Soon</Title>
              <Text>
                오픈 알림 신청 완료!
                <br />
                새로운 게임이 열리면 알려드릴게요
              </Text>
            </Card>
          ) : (
            <Card
              game={`whats-next`}
              onClick={handleNewGameNotification}
              style={{
                border: `1px solid #ECECEC`,
              }}
            >
              <CardImg3 src={WhatsNextCardImgUrl} />
              <Title>What's Next?</Title>
              <Text>
                <span>오픈 알림</span>을 신청하면
                <br />
                빠르게 대회에 참여할 수 있어요!
              </Text>
              <ActionButton src={BellUrl} />
            </Card>
          )}
        </CardContainer>
        <Break />
        <SectionTitle style={{ marginBottom: `15px` }}>
          하고 싶은 게임이 있나요?
        </SectionTitle>

        <GameSurvey>
          <ModalOpenButton onClick={goToSurveyPage}>
            <p className="left-text">예) 테트리스</p>
            <p className="right-text">보내기</p>
          </ModalOpenButton>
        </GameSurvey>
      </Page>

      <SubscribeToastContainer />
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: calc(100vh - ${navHeight}px);
`;

const MainText = styled.div`
  padding: 0 ${rem(20)};
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
  padding: 0 ${rem(20)};
  color: #3f3f3f;
`;
const CardContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${rem(30)};
  padding: 0 ${rem(20)};
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

  h3 {
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
    margin: 0 ${rem(50)} 0 ${rem(105)};

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

const Title = styled.h3`
  font-weight: bold;
  font-size: ${rem(24)};
  line-height: 161.7%;
  /* or 39px */
`;
const Text = styled.p`
  font-weight: normal;
  font-size: ${rem(12)};
  line-height: 161.7%;
  /* or 19px */
`;
const CardImg1 = styled.img`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: ${rem(80)};
  height: ${rem(115)};
  position: absolute;
  bottom: 10px;
  left: 0;
`;
const CardImg2 = styled.img`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: ${rem(60)};
  height: ${rem(130)};
  position: absolute;
  bottom: 0;
  left: 23px;
`;
const CardImg3 = styled.img`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: ${rem(71)};
  height: ${rem(93)};
  position: absolute;
  bottom: -3px;
  left: 15px;
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

const Break = styled.div`
  background: #f8f8f8;
  height: 6px;
  margin: 30px 0 22px;
`;

const GameSurvey = styled.div`
  margin: 0 20px 0 20px;
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

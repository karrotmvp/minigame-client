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
import { getMini } from 'services/karrotMarket/mini';
import { color } from 'styles';
import BellUrl from 'assets/svg/bell.svg';
import Game2048CardImgUrl from 'assets/svg/game2048/game_2048_card_img.svg';
import KarrotClickerCardImgUrl from 'assets/svg/KarrotClicker/karrot_clicker_card_img.svg';
import WhatsNextCardImgUrl from 'assets/svg/whats_next_card_img.svg';
import ComingSoonCardImgUrl from 'assets/svg/coming_soon_card_img.svg';
import ArrowGame2048Url from 'assets/svg/arrow_game_2048.svg';
import ArrowKarrotClickerUrl from 'assets/svg/arrow_karrot_clicker.svg';
import { ReactComponent as Bookmark } from 'assets/svg/bookmark.svg';
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import { motion, AnimatePresence } from 'framer-motion';
import { SuggestNewGame } from './SuggestNewGame';

export const Home: React.FC = () => {
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { isTop } = useCurrentScreen();
  const { push } = useNavigator();
  const { isInWebEnvironment, ejectApp } = useMini();
  const { accessToken } = useAccessToken();
  const { setUserInfo, townName3 } = useUserData();
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

  const goToGame2048 = async () => {
    setGameTypeToGame2048();
    // bypass in web environment
    if (isInWebEnvironment) {
      console.log('bypass in web environment: main to game-2048');
      push(`/game-2048`);
      return;
    }
    try {
      analytics.logEvent('click_game_enter_button', {
        game_type: 'game-2048',
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
      analytics.logEvent('click_game_enter_button', {
        game_type: 'karrot-clicker',
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
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserInfo = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.userApi.getUserInfoUsingGET();
    if (data) {
      setUserInfo(data.id, data.nickname);
      // FA: track user with set user id
      analytics.setUserId(data.id);
      console.log('setuserinfo', data.id, data.nickname);
    }
  }, [analytics, minigameApi.userApi, setUserInfo]);

  useEffect(() => {
    if (isTop && accessToken) {
      console.log('is platform page on top?', isTop);
      updateUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isTop]);

  const handleInstallation = () => {
    const mini = getMini();
    mini.startPreset({
      preset: `https://mini-assets.kr.karrotmarket.com/presets/mvp-game-recommend-installation/alpha.html`,
      onSuccess: async function (result) {
        if (result.ok) {
          console.log('즐겨찾기 성공');
        }
      },
    });
  };

  const handleNewGameNotification = async () => {
    const { data } =
      await minigameApi.notificationApi.saveNotificationUsingPOST({
        type: 'game' as NotificationRequestDtoTypeEnum,
      });
    if (data.status === 200) {
      console.log('notification (game) success');
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <>
      <Nav
        appendLeft={<CloseIcon />}
        onClickLeft={leaveMiniApp}
        appendRight={<Bookmark />}
        onClickRight={handleInstallation}
      />

      <Page className="game-platform-page">
        <SectionTitle style={{ marginBottom: `30px` }}>
          <span>{townName3}</span> 이웃들과
          <br />
          같이 게임해요!
        </SectionTitle>
        <CardContainer className="container--games">
          <Card game={`game-2048`} onClick={goToGame2048}>
            <CardImg1 src={Game2048CardImgUrl} />
            <Title>2048 퍼즐</Title>
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
          {}
          <Card game={`whats-next`} onClick={handleNewGameNotification}>
            <CardImg3 src={WhatsNextCardImgUrl} />
            <Title>What's Next?</Title>
            <Text>
              <span>오픈 알림</span>을 신청하면
              <br />
              빠르게 대회에 참여할 수 있어요!
            </Text>
            <ActionButton src={BellUrl} />
          </Card>
          <Card game={`coming-soon`}>
            <CardImg3 src={ComingSoonCardImgUrl} />
            <Title>Coming Soon</Title>
            <Text>
              오픈 알림 신청 완료!
              <br />
              새로운 게임이 열리면 알려드릴게요
            </Text>
          </Card>
        </CardContainer>
        <Break />
        <SectionTitle style={{ marginBottom: `15px` }}>
          하고 싶은 게임이 있나요?
        </SectionTitle>

        <div>
          <ModalOpenButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="save-button"
            onClick={() => (modalOpen ? close() : open())}
          >
            Launch modal
          </ModalOpenButton>
        </div>
        <AnimatePresence
          // Disable any initial animations on children that
          // are present when the component is first rendered
          initial={false}
          // Only render one component at a time.
          // The exiting component will finish its exit
          // animation before entering component is rendered
          exitBeforeEnter={true}
          // Fires when all exiting nodes have completed animating out
          onExitComplete={() => null}
        >
          {modalOpen && <SuggestNewGame handleClose={close} />}
        </AnimatePresence>
      </Page>
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  font-style: normal;
  font-weight: normal;
`;

const SectionTitle = styled.div`
  padding: 0 ${rem(40)};
  color: #3f3f3f;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 162.7%;

  span {
    color: #0e74ff;
    font-size: ${rem(34)};
  }
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

const Break = styled.hr`
  border: 6px solid #f8f8f8;
  margin: 30px 0 22px;
`;

// const BottomSection = styled.div`

// `

const ModalOpenButton = styled(motion.button)`
  display: flex;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  padding: 10px;

  input {
    width: 100%;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 161.7%;
    /* identical to box height, or 26px */
    border: none;
    color: #3f3f3f;

    &::placeholder {
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
      line-height: 161.7%;
      /* identical to box height, or 26px */

      color: #e0e0e0;
    }
  }
  span {
    position: inline;
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(12)};
    line-height: 161.7%;
    /* or 19px */

    color: #a9a9a9;
  }
`;

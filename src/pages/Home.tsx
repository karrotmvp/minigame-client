import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini } from 'hooks';
import { Nav } from 'components/Navigation/Nav';
import { BackIcon, CloseIcon } from 'assets/Icon';
import { rem } from 'polished';
import { useMyGame2048Data } from './Game2048/hooks';
import { useMyKarrotClickerData } from './KarrotClicker/hooks';
import Game2048CardImgUrl from 'assets/svg/game2048/game_2048_card_img.svg';
import KarrotClickerCardImgUrl from 'assets/svg/KarrotClicker/karrot_clicker_card_img.svg';

export const Home: React.FC = () => {
  const minigameApi = useMinigameApi();
  const { push } = useNavigator();
  const { isTop } = useCurrentScreen();
  const { isInWebEnvironment, ejectApp } = useMini();
  const [userCount, setUserCount] = useState<number>(0);
  const { updateMyGame2048Data, setGameTypeToGame2048 } = useMyGame2048Data();
  const {
    updateMyKarrotClickerData,
    updateMyComment,
    setGameTypeToKarrotClicker,
  } = useMyKarrotClickerData();
  const exitApp = () => {
    console.log('Ejected from the app. Now back to Karrot Market');
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
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_2048');
      if (data) {
        if (data && data.score && data.rank && data.comment) {
          updateMyGame2048Data(data.score, data.rank, data.comment);
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
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
      if (data) {
        if (data.score && data.rank) {
          updateMyKarrotClickerData(data.score, data.rank);
        }
        if (data.comment) {
          updateMyComment(data.comment);
        }
      }
      push(`/karrot-clicker`);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserCount = useCallback(async () => {
    const { data } = await minigameApi.userApi.getUserCountUsingGET();
    if (data.data) {
      setUserCount(data.data);
    }
  }, [minigameApi]);

  useEffect(() => {
    if (isTop) {
      getUserCount();
    }
  }, [getUserCount, isTop]);

  return (
    <Page className="game-platform-page">
      <Nav appendLeft={<CloseIcon />} onClickLeft={leaveMiniApp} />
      <Greetings>
        <span>{townName3}</span> 이웃들과
        <br />
        같이 게임해요!
      </Greetings>
      <Games>
        <Card color={`blue`} onClick={goToGame2048}>
          <Title>2048 퍼즐</Title>
          {/* <Arrow /> */}

          <Text>
            동네 천재 타이틀을 원한다면?
            <br />
            중독성 갑 퍼즐 게임
          </Text>
        </Card>
        <Card game={`karrot-clicker`} onClick={goToKarrotClicker}>
          <CardImg2 src={KarrotClickerCardImgUrl} />
          <Title>당근모아</Title>
          <Text>
            남는 게 시간이라면?
            <br />
            귀여운 클리커 게임
          </Text>
        </Card>
      </Games>
      <Break />
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  font-style: normal;
  font-weight: normal;
`;

const Greetings = styled.div`
  padding: ${rem(5)} ${rem(40)};
  color: #3f3f3f;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 162.7%;

  span {
    color: #0e74ff;
    font-size: ${rem(34)};
  }
`;

const Games = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${rem(30)};
  padding: ${rem(30)} ${rem(20)} ${rem(35)};
`;
const Card = styled.a<{ game: string }>`
  width: 100%;
  padding: ${rem(18)} 0 ${rem(18)} ${rem(106)};
  border: none;
  border-radius: 10px;
  background-color: ${(props) =>
    props.game === `game-2048`
      ? `#0E74FF`
      : props.color === `orange`
      ? `#FF8845`
      : `#EFEFEF`};
  box-shadow: ${(props) =>
    props.game === `game-2048`
      ? `0px 8px 0px 0px #0D5AC4`
      : `karrot-clicker`
      ? `0px 8px 0px 0px #D96726`
      : `0px 8px 0px 0px #BABABA`};

  position: relative;
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
const Arrow = styled.span`
  height: 25px;
  width: 25px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
`;

const Title = styled.h1`
  font-family: Cafe24Ssurround;
  font-weight: bold;
  font-size: ${rem(24)};
  line-height: 161.7%;
  /* or 39px */

  color: #ffffff;
`;
const Text = styled.p`
  font-weight: normal;
  font-size: ${rem(12)};
  line-height: 161.7%;
  /* or 19px */

  color: #ffffff;
`;
const Break = styled.hr`
  border: 6px solid #f8f8f8;
  margin-bottom: 25px;
`;

// const BottomSection = styled.div`

// `

import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini } from 'hooks';
import { Nav } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';
import { rem } from 'polished';
import { commafy } from 'utils/functions/numberFunctions';
import { useMyGame2048Data } from './Game2048/hooks';
import { useMyKarrotClickerData } from './KarrotClicker/hooks';

export const Home: React.FC = () => {
  const minigameApi = useMinigameApi();
  const { push } = useNavigator();
  const { isTop } = useCurrentScreen();
  const { isInWebEnvironment, ejectApp } = useMini();
  const [userCount, setUserCount] = useState<number>(0);
  const { updateMyGame2048Data, setGameTypeToGame2048 } = useMyGame2048Data();
  const { updateMyKarrotClickerData, setGameTypeToKarrotClicker } =
    useMyKarrotClickerData();
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
    } else {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_2048');
      if (data) {
        updateMyGame2048Data(data.score, data.rank!, data.comment);
      }
      push(`/game-2048`);
    }
  };

  const goToKarrotClicker = async () => {
    setGameTypeToKarrotClicker();
    if (isInWebEnvironment) {
      console.log('bypass in web environment: main to karrot-clicker');
      push(`/karrot-clicker`);
    } else {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
      if (data) {
        updateMyKarrotClickerData(data.score, data.rank!, data.comment);
      }
      push(`/karrot-clicker`);
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
    <Page className="main-page">
      <Nav appendLeft={<CloseIcon />} onClickLeft={exitApp} />
      <Greetings>
        <span>{commafy(userCount)}</span>명의
        <br />
        이웃들과 같이 게임해요!
      </Greetings>
      <Games>
        <Card color={`blue`} onClick={goToGame2048}>
          <Title>2048 퍼즐</Title>
          <Text>
            동네 천재 타이틀을 원한다면?
            <br />
            중독성 갑 퍼즐 게임
          </Text>
        </Card>
        <Card color={`orange`} onClick={goToKarrotClicker}>
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
  padding: 0 ${rem(26)};
  color: #3f3f3f;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 162.7%;

  span {
    color: #0e74ff;
    font-size: ${rem(40)};
  }
`;

const Games = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${rem(25)};
  padding: ${rem(25)} ${rem(20)} ${rem(35)};
`;
const Card = styled.a<{ color: string }>`
  width: 100%;
  padding: ${rem(18)} 0 ${rem(18)} ${rem(106)};
  border: none;
  border-radius: 10px;
  background-color: ${(props) =>
    props.color === `blue`
      ? `#0E74FF`
      : props.color === `orange`
      ? `#FF8845`
      : `#EFEFEF`};
  box-shadow: ${(props) =>
    props.color === `blue`
      ? `0px 8px 0px 0px #0D5AC4`
      : `orange`
      ? `0px 8px 0px 0px #D96726`
      : `0px 8px 0px 0px #BABABA`};
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

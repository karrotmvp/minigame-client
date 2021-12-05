import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { CircleBackIcon } from 'assets/Icon';
import { Button } from 'components/Button';
import { Nav } from 'components/Navigation';
import { rem } from 'polished';
import React, { useEffect } from 'react';
import { BottomCTAContainer, PageContainer } from 'styles';
import arrow_back_right_white from 'assets/svg/arrow_back_right_white.svg';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../Game2048/hooks';
import { useMyKarrotClickerData } from '../KarrotClicker/hooks';
import { useAccessToken } from 'hooks';
import { useUser } from 'redux/user';

export const Mission: React.FC = () => {
  const { pop, replace } = useNavigator();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();

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

  const { setMissionPreference } = useUser();
  useEffect(() => {
    if (isTop) {
      localStorage.setItem(
        'missionPreference',
        JSON.stringify({
          isMissionCheckedOut: true,
          hasMissionPopupSeen: true,
        })
      );
      setMissionPreference({
        isMissionChekcedOut: true,
        hasMissionPopupSeen: true,
      });
    }
  }, [setMissionPreference, isTop]);

  const goBackToPlatform = () => {
    pop();
  };
  const goToGame2048 = async () => {
    setGameTypeToGame2048();
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
            updateMyGame2048Score({
              score: data.score,
              rank: data.rank,
            });
          }
          if (data.comment) {
            updateMyGame2048Comment(data.comment);
          }
        }
        replace(`/game-2048`);
      } else {
        analytics.logEvent('click_game_enter_button', {
          game_type: '2048_puzzle',
          is_new_user: true,
        });
        replace(`/game-2048`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const goToKarrotClicker = async () => {
    setGameTypeToKarrotClicker();
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
        replace(`/karrot-clicker`);
      } else {
        analytics.logEvent('click_game_enter_button', {
          game_type: 'karrot_clicker',
          is_new_user: true,
        });
        replace(`/karrot-clicker`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav
        appendLeft={<CircleBackIcon />}
        onClickLeft={goBackToPlatform}
        style={{ alignItems: 'center', height: '80px' }}
      />
      <PageContainer>
        <img
          src="https://minigame-karrot-raise-client-production.s3.ap-northeast-2.amazonaws.com/mission_page.png"
          alt="mission-description"
          style={{ marginTop: `-80px` }}
        />
        <BottomCTAContainer
          style={{
            position: 'initial',
            flexFlow: 'column',
            gap: `20px`,
            height: `auto`,
            borderTop: 'none',
            boxShadow: 'none',
            padding: '0px 26px 40px',
          }}
        >
          <Button
            size={'large'}
            fontSize={rem(16)}
            color={'primary'}
            onClick={goToGame2048}
            style={{ padding: `12px 0` }}
          >
            <Text>2048 1등 하러 가기</Text>
          </Button>
          <Button
            size={'large'}
            fontSize={rem(16)}
            color={''}
            style={{
              backgroundColor: '#EB5D0E',
              boxShadow: `0px 6px 0px 0px #C64F0C`,
              padding: `12px 0`,
            }}
            onClick={goToKarrotClicker}
          >
            <Text>당근모아 1등 하러 가기</Text>
          </Button>
        </BottomCTAContainer>
      </PageContainer>
    </>
  );
};

const Text = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(20)};
  color: #ffffff;
  position: relative;

  &:after {
    content: '';
    background-image: url(${arrow_back_right_white});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 15px;
    height: 15px;
    position: absolute;
    top: 4px;
    right: 12px;
  }
`;

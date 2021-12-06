import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Nav } from 'components/Navigation/Nav';
import { BackIcon } from 'assets/Icon';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { rem } from 'polished';
import { color, PageContainer } from 'styles';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useUserData } from 'hooks';
import { SurveyToastContainer, surveyToastEmitter } from 'components/Toast';
import { useAnalytics } from 'services/analytics';
import { useUser } from 'redux/user';

export const Survey: React.FC = () => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const { pop } = useNavigator();
  const minigameApi = useMinigameApi();
  const { regionId } = useUserData();
  const [gameSurveyInput, setGameSurveyInput] = useState('');
  const inputRef = useRef<any>();

  const { uuid } = useUser();

  const goToPlatformPage = () => {
    pop();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSurveyInput(e.target.value);
  };

  const postGameSurvey = async ({
    uuid,
    regionId,
    content,
  }: {
    uuid: string;
    regionId: string;
    content: string;
  }) => {
    try {
      const { data } = await minigameApi.surveyApi.registerGameSurveyUsingPOST(
        uuid,
        regionId,
        {
          content,
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const submitGameSurvey = async () => {
    inputRef.current.focus();
    const response = await postGameSurvey({
      uuid: uuid,
      regionId: regionId,
      content: gameSurveyInput,
    });
    if (response?.status === 200) {
      analytics.logEvent('click_submit_game_request_button');
      setGameSurveyInput('');
      surveyToastEmitter();
    }
  };

  useEffect(() => {
    if (isTop) {
      const timerId = setTimeout(() => {
        inputRef.current.focus();
      }, 300);
      return clearTimeout(timerId);
    }
  }, [isTop]);
  return (
    <>
      <Nav appendLeft={<BackIcon />} onClickLeft={goToPlatformPage} />
      <PageContainer id="survey-page">
        <GameSurvey>
          <h3>하고 싶은 게임이 있나요?</h3>
          <div>
            <input
              ref={inputRef}
              type="text"
              onChange={handleInputChange}
              value={gameSurveyInput}
            />
          </div>
          <p>예) 테트리스, 공룡점프</p>
        </GameSurvey>
        <ActionItems>
          {gameSurveyInput.length <= 0 ? (
            <Button
              size={`large`}
              fontSize={rem(20)}
              color={``}
              type={`disabled`}
            >
              보내기
            </Button>
          ) : (
            <Button
              size={`large`}
              fontSize={rem(20)}
              color={`primary`}
              onClick={submitGameSurvey}
            >
              보내기
            </Button>
          )}
        </ActionItems>
      </PageContainer>
      <SurveyToastContainer />
    </>
  );
};

const GameSurvey = styled.div`
  flex: 1;

  h3 {
    font-family: Pretendard;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 121.2%;
    /* or 24px */

    color: #3f3f3f;

    margin-left: 40px;
  }

  div {
    display: flex;
    box-sizing: border-box;
    border: 1px solid ${color.blue400};
    border-radius: 10px;

    height: 40px;
    padding: 10px;
    margin: 17px 20px 7px 20px;
    input {
      width: 100%;
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
      line-height: 161.7%;
      /* identical to box height, or 26px */
      border: none;
      color: #3f3f3f;
    }
  }

  p {
    font-family: Pretendard;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #a9a9a9;

    margin-left: 34px;
  }
`;

const ActionItems = styled.div`
  width: 100%;
  height: 90px;
  padding: 15px 18px 30px;

  display: flex;
  justify-content: center;

  background: #ffffff;
  box-sizing: border-box;

  z-index: 100;
`;

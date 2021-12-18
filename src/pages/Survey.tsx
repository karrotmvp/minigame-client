import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Nav } from 'components/Navigation/Nav';
import { ReactComponent as IconArrowBack } from 'assets/icon/svg/icon_arrow_back.svg';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { rem } from 'polished';
import { color, PageContainer } from 'styles';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useUser } from 'hooks';
import { SurveyToastContainer, surveyToastEmitter } from 'components/Toast';
import { useAnalytics } from 'services/analytics';

export const Survey: React.FC = () => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const { pop } = useNavigator();
  const minigameApi = useMinigameApi();
  const [gameSurveyInput, setGameSurveyInput] = useState('');
  const inputRef = useRef<any>();

  const { user } = useUser();

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
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const submitGameSurvey = async () => {
    inputRef.current.focus();
    const response = await postGameSurvey({
      uuid: user.uuid as string,
      regionId: user.regionId as string,
      content: gameSurveyInput,
    });
    if (response?.status === 200) {
      analytics.logEvent('click_survey_feedback_submit_button');
      setGameSurveyInput('');
      surveyToastEmitter();
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_survey_page');
      const timerId = setTimeout(() => {
        inputRef.current.focus();
      }, 300);
      return clearTimeout(timerId);
    }
  }, [analytics, isTop]);
  return (
    <>
      <Nav
        appendLeft={<IconArrowBack style={{ fill: '#7c7c7c' }} />}
        onClickLeft={goToPlatformPage}
      />
      <PageContainer id="survey-page">
        <GameSurvey>
          <h3>이웃 여러분의 의견을 들려주세요</h3>
          <p>
            동네대회 서비스에 바라는 점이 있나요?
            <br />
            또는, 아쉬웠던 점이 있나요?
          </p>
          <p>
            이웃 여러분의 소중한 의견은 동네대회를 더욱 재밌는 <br />
            서비스로 발전시킬 수 있는 큰 도움이 돼요
          </p>

          <div>
            <input
              ref={inputRef}
              type="text"
              onChange={handleInputChange}
              value={gameSurveyInput}
            />
          </div>
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

    margin-left: 20px;
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
    font-size: ${rem(14)};
    line-height: 170%;
    color: #7c7c7c;
    margin: 20px;
    overflow-wrap: break-word;
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

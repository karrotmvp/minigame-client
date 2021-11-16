import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Nav } from 'components/Navigation/Nav';
import { BackIcon } from 'assets/Icon';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { rem } from 'polished';
import { color } from 'styles';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useUserData } from 'hooks';

export const Survey: React.FC = () => {
  const { pop } = useNavigator();
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { regionId } = useUserData();
  const [gameSurveyInput, setGameSurveyInput] = useState('');
  const inputRef = useRef<any>();

  const goToPlatformPage = () => {
    pop();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSurveyInput(e.target.value);
  };
  const submitGameSurvey = async () => {
    const { data } = await minigameApi.surveyApi.registerGameSurveyUsingPOST({
      content: gameSurveyInput,
      regionId: regionId,
    });
    if (data.status === 200) {
      setGameSurveyInput('');
    }
  };
  useEffect(() => {
    if (isTop) {
      inputRef.current.focus();
    }
  }, [isTop]);
  return (
    <>
      <Nav appendLeft={<BackIcon />} onClickLeft={goToPlatformPage} />
      <Page>
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
          <Button
            size={`large`}
            fontSize={rem(20)}
            color={`primary`}
            onClick={submitGameSurvey}
          >
            보내기
          </Button>
        </ActionItems>
      </Page>
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: calc(100% - ${rem(90)});
`;

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
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${rem(15)} ${rem(18)} ${rem(30)};

  box-sizing: border-box;
`;

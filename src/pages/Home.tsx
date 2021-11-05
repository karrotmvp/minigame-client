import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import useUserData from 'hooks/useUserData';
import { useMinigameApi } from 'services/api/minigameApi';

const HomePage = styled.div`
  // height: calc(100% -2.75rem);
  // width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Cell = styled.div<{ backgroundColor: string }>`
  // aspect-ratio: 1;
  background-color: ${(props) => props.backgroundColor};
`;

const Title = styled.h1`
  font-family: Cafe24Ssurround;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 161.7%;
  /* or 39px */

  color: #ffffff;
`;
export const Home: React.FC = () => {
  const api = useMinigameApi();
  // api.oauth2Api().karrotLoginUsingPOST(requestDto).then((request))

  // const resp = api.oauth2Api().karrotLoginUsingPOST({code: "", regionId: ""})
  const { push } = useNavigator();
  const {
    accessToken,
    // userId,
    userDistrictName,
    userNickname,
    userScore,
    userRank,
    userComment,
    // onUpdateUserData,
  } = useUserData();
  useEffect(() => {
    console.log(
      accessToken,
      // userId,
      userDistrictName,
      userNickname,
      userScore,
      userRank,
      userComment
    );
  }, []);
  return (
    <HomePage>
      <ScreenHelmet
        title="My App"
        // appendLeft={<div>Append to Left</div>}
        // appendRight={<div>Append to Right</div>}
        // customBackButton={<div>Back</div>}
        // customCloseButton={<div>Close</div>}
      />
      <h1>어서오세요 user_nickname님</h1>
      <div>동네 사람들과 같이 게임해요!</div>
      <Grid>
        <Cell backgroundColor={`#0E74FF`} onClick={() => push(`/game-2048`)}>
          <Title>2048 퍼즐</Title>
        </Cell>
        <Cell
          backgroundColor={`#FF8845`}
          onClick={() => push(`/karrot-clicker`)}
        >
          <Title>당근모아</Title>
        </Cell>
        <Cell backgroundColor={`#0E74FF`}>
          <Title>2048 퍼즐</Title>
        </Cell>
        <Cell backgroundColor={`#0E74FF`}>
          <Title>2048 퍼즐</Title>
        </Cell>
      </Grid>
    </HomePage>
  );
};

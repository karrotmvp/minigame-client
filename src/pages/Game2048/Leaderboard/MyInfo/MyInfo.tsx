import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { commafy } from 'utils/numberFunctions';
import { useUserData } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';

export const MyInfo: React.FC = () => {
  const {
    nickname,
    townName1: cityName,
    townName2: districtName,
  } = useUserData();
  const { score, rank, highestScore, highestRank } = useMyGame2048Data();

  return (
    <Container className="my-info">
      <Row>
        <Info>
          <Rank>{rank}</Rank>
          <Name>
            {nickname}
            <District>
              {cityName.slice(0, 2)} {districtName}
            </District>
          </Name>
        </Info>
        <Score>{commafy(score)}</Score>
      </Row>
      <Hr />
      <Row>
        <Wrapper>
          역대 최고랭킹
          <Score>{highestRank}</Score>
        </Wrapper>
        <Wrapper
          style={{
            marginLeft: '20px',
          }}
        >
          역대 최고기록<Score>{commafy(highestScore)}</Score>
        </Wrapper>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding: ${rem(18)} ${rem(20)} ${rem(12)};
  margin-bottom: ${rem(12)};
  width: 100%;

  background: #ffffff;
  border: 1px solid #5ba1ff;
  box-sizing: border-box;
  border-radius: 10px;

  font-style: normal;
  font-weight: normal;
`;
const Hr = styled.hr`
  border: 0.1px solid #d1deea;
  margin: 10px 0;
`;
const Row = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 10px;
`;
const Rank = styled.div`
  color: #0e74ff;
  font-size: ${rem(10)};
`;

const Name = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 5px;
  color: #0e74ff;
  font-weight: bold;
  font-size: ${rem(16)};
`;

const District = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 1px 5px;
  border: 0.5px solid #0e74ff;
  box-sizing: border-box;
  border-radius: 7px;
  font-size: ${rem(8)};
  font-weight: normal
  color: #0e74ff;
`;

const Score = styled.div`
  font-size: ${rem(12)};
  text-align: right;
  color: #0e74ff;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  font-size: ${rem(10)};
  text-align: right;
  flex: 1;
  color: #96a8b9;
`;

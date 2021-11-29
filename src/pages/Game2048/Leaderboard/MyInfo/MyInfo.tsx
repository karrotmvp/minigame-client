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
      <div className="row">
        <Info>
          <Rank>{rank}</Rank>
          <Name>
            {nickname}
            <District>
              {cityName.replace(/(특별시|광역시|특별자치시|특별자치도)$/, '')}
              &nbsp;{districtName}
            </District>
          </Name>
        </Info>
        <Score>{commafy(score)}</Score>
      </div>
      <div
        style={{
          borderTop: `1px solid #ebebeb`,
          margin: `10px 0 5px`,
        }}
      />
      <div className="row">
        <div className="col">
          역대 최고랭킹
          <Score>{highestRank}</Score>
        </div>
        <div
          style={{
            borderLeft: `1px solid #EBEBEB`,
            height: `24px`,
            margin: `0 11px`,
          }}
        />
        <div className="col">
          역대 최고기록<Score>{commafy(highestScore)}</Score>
        </div>
      </div>
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

  div.row {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;

    div.col {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      font-size: ${rem(10)};
      text-align: right;
      flex: 1;
      color: #7c7c7c;
    }
  }
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

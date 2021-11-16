import styled from '@emotion/styled';
import { DefaultDistrictRow, TopDistrictRow } from '../Row';

type Props = {
  districtLeaderboardData: any[];
};
export const DistrictLeaderboard: React.FC<Props> = (props) => {
  // const getDistrictLeaderboardData = async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
  //   if (data) {
  //     const indexedDistrictRankData = data.map((item: any, index: number) => ({
  //       rank: index + 1,
  //       ...item,
  //     }));

  //     setDistrictLeaderboardData(() => indexedDistrictRankData);
  //   }
  // };

  return (
    <Container>
      <Wrapper>
        {props.districtLeaderboardData.slice(0, 10).map((district) => {
          return (
            <TopDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
            />
          );
        })}
        {props.districtLeaderboardData.slice(10).map((district) => {
          return (
            <DefaultDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
            />
          );
        })}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 60px;

  // Hide scrollbar but keep functionality
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

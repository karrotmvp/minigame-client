import styled from '@emotion/styled';
import { TopUserRow } from '../Row/TopRow';
import { DefaultUserRow } from '../Row/DefaultRow';

type Props = {
  userLeaderboardData: any[];
};
export const UserLeaderboard: React.FC<Props> = (props) => {
  return (
    <Container>
      <LeaderboardWrapper>
        {props.userLeaderboardData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.userId}
              rank={user.rank}
              userName={user.nickname}
              comment={user.comment}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          );
        })}
        <Text>
          🎉 TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </Text>
        {props.userLeaderboardData.slice(10).map((user) => {
          return (
            <DefaultUserRow
              key={user.userId}
              rank={user.rank}
              userName={user.nickname}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          );
        })}
      </LeaderboardWrapper>
    </Container>
  );
};

const Container = styled.div`
  // max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const LeaderboardWrapper = styled.div`
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

const Text = styled.p`
  margin: 17px 0 17px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* or 26px */

  text-align: center;

  color: #7c7c7c;
`;

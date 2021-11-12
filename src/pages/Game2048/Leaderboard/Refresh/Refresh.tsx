import styled from '@emotion/styled';
import { RefreshButton } from 'components/Button';
// import { WeeklyCountdown } from 'components/Timer';
import { rem } from 'polished';
import React from 'react';

const Container = styled.div`
  font-style: normal;
  font-weight: normal;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: ${rem(25)} ${rem(20)} ${rem(15)};
`;

const Text = styled.p`
  color: #5b5b5b;
  font-weight: bold;
  font-size: ${rem(16)};
  line-height: 122.2%;
  margin-left: 8px;
`;

const Countdown = styled.span`
  display: inline;
  margin-left: 5px;
  font-weight: normal;
  color: #5b5b5b;
  font-size: ${rem(10)};
  span {
    color: #0e74ff;
    font-size: ${rem(10)};
  }
`;

type Props = {
  handleRefresh: () => void;
};
export const Refresh: React.FC<Props> = (props) => {
  return (
    <Container className="refresh">
      <Text>
        이번 주 랭킹
        {/* <Countdown>
          (초기화까지
          <span>
            <WeeklyCountdown />
          </span>
          )
        </Countdown> */}
      </Text>
      <RefreshButton handleRefresh={props.handleRefresh} />
    </Container>
  );
};

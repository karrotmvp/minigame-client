import React from 'react';
import styled from '@emotion/styled';
import { WeeklyCountdown } from 'components/Timer';
import { rem } from 'polished';

// const Text = styled.p`
//   color: #5b5b5b;
//   font-weight: bold;
//   font-size: ${rem(16)};
//   line-height: 122.2%;
//   margin-left: 8px;
// `;

const Countdown = styled.div`
  display: inline-flex;
  p {
    font-weight: normal;
    font-size: ${rem(12)};
    color: #e3efff;
    span {
      color: #ffdc79;
      font-size: ${rem(12)};
    }
  }
`;

type Props = {
  handleRefresh?: () => void;
};

const Refresh: React.FC<Props> = (props) => {
  return (
    <Countdown>
      <p>
        초기화까지&nbsp;
        <span>
          <WeeklyCountdown />
        </span>
      </p>
    </Countdown>
  );
};

export const MemoizedRefresh = React.memo(Refresh);

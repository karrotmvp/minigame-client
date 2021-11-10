import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import { DistrictLeaderboard, IndividualLeaderboard } from './Leaderboard';

export const LeaderboardTabs = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('district');
  // console.log('leaderboard tabs');
  return (
    <LeaderboardContainer>
      <Tabs
        className={css`
          --kf_tabs_tabBar-baseFontColor: #5b5b5b;
          --kf_tabs_tabBar-activeFontColor: #ff8845;
          --kf_tabs_tabBar-indicator-color: #ff8845;
        `}
        activeTabKey={activeTabKey}
        tabs={[
          {
            key: 'district',
            buttonLabel: '동네별',
            component: useCallback(() => <DistrictLeaderboard />, []),
          },
          {
            key: 'individual',
            buttonLabel: '주민별',
            component: useCallback(() => <IndividualLeaderboard />, []),
          },
        ]}
        onTabChange={(key) => {
          setActiveTabKey(key);
        }}
      />
    </LeaderboardContainer>
  );
};

const LeaderboardContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 18px 18px 0;
  margin: 0 18px;
  max-height: inherit;
  background: #ffffff;
  border: 1px solid #ebe0db;
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;
  border-bottom-style: none;
`;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import DistrictLeaderboard from './DistrictLeaderboard';
import IndividualLeaderboard from './IndividualLeaderboard';

const customizeTabs = css`
  --kf_tabs_tabBar-baseFontColor: #5b5b5b;
  --kf_tabs_tabBar-activeFontColor: #ff8845;
  --kf_tabs_tabBar-indicator-color: #ff8845;
`;
const LeaderboardTabs = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('district');
  console.log('leaderboard tabs');
  return (
    <Tabs
      css={customizeTabs}
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
  );
};

export default LeaderboardTabs;

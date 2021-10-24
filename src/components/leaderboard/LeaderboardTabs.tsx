import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import DistrictLeaderboard from './DistrictLeaderboard';
import IndividualLeaderboard from './IndividualLeaderboard';

const LeaderboardTabs = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('district');
  console.log('leaderboard tabs');
  return (
    <Tabs
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

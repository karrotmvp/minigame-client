import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useState } from 'react';
import DistrictLeaderboard from './DistrictLeaderboard';
import IndividualLeaderboard from './IndividualLeaderboard';

const LeaderboardTabs = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('individual');

  return (
    <Tabs
      activeTabKey={activeTabKey}
      tabs={[
        {
          key: 'individual',
          buttonLabel: '동네별',
          component: () => <DistrictLeaderboard />,
        },
        {
          key: 'district',
          buttonLabel: '주민별',
          component: () => <IndividualLeaderboard />,
        },
      ]}
      onTabChange={(key) => {
        setActiveTabKey(key);
      }}
    />
  );
};

export default LeaderboardTabs;

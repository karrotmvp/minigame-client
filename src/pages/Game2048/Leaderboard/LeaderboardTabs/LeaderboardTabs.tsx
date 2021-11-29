import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import {
  MemoizedDistrictLeaderboard as DistrictLeaderboard,
  MemoizedUserLeaderboard as UserLeaderboard,
} from './Leaderboard';

type Props = {
  districtLeaderboardData: any[];
  userLeaderboardData: any[];
  isRanked: boolean;
};
const LeaderboardTabs: React.FC<Props> = (props) => {
  console.log(props.userLeaderboardData);
  const { isTop } = useCurrentScreen();
  const [activeTabKey, setActiveTabKey] = useState<string>('district');
  const handleTabChange = (key: string) => {
    if (isTop) {
      setActiveTabKey(key);
    }
  };
  return (
    <LeaderboardContainer>
      <Tabs
        className={css`
          --kf_tabs_tabBar-borderColor: none;
          --kf_tabs_tabBar-indicator-color: none;
          --kf_tabs_tabBar-activeFontColor: #0e74ff;
        `}
        activeTabKey={activeTabKey}
        tabs={[
          {
            key: 'district',
            buttonLabel: '지역 랭킹',
            component: useCallback(
              () => (
                <DistrictLeaderboard
                  districtLeaderboardData={props.districtLeaderboardData}
                  isRanked={props.isRanked}
                />
              ),
              [props.districtLeaderboardData, props.isRanked]
            ),
          },
          {
            key: 'individual',
            buttonLabel: '전국 랭킹',
            component: useCallback(
              () => (
                <UserLeaderboard
                  userLeaderboardData={props.userLeaderboardData}
                  isRanked={props.isRanked}
                />
              ),
              [props.isRanked, props.userLeaderboardData]
            ),
          },
        ]}
        onTabChange={handleTabChange}
      />
    </LeaderboardContainer>
  );
};

export const MemoizedLeaderboardTabs = React.memo(LeaderboardTabs);
const LeaderboardContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
  background: #ffffff;
  box-sizing: border-box;
`;

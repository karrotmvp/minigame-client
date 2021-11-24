import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import { DistrictLeaderboard, UserLeaderboard } from './Leaderboard';

type Props = {
  districtLeaderboardData: any[];
  userLeaderboardData: any[];
  shouldSticky?: boolean;
};
export const LeaderboardTabs: React.FC<Props> = (props) => {
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
                />
              ),
              [props.districtLeaderboardData]
            ),
          },
          {
            key: 'individual',
            buttonLabel: '전국 랭킹',
            component: useCallback(
              () => (
                <UserLeaderboard
                  userLeaderboardData={props.userLeaderboardData}
                />
              ),
              [props.userLeaderboardData]
            ),
          },
        ]}
        onTabChange={handleTabChange}
      />
    </LeaderboardContainer>
  );
};

const LeaderboardContainer = styled.div`
  flex: 1;
  height: calc(100% - 36px);
  overflow: auto;
  // max-height: inherit;
  background: #ffffff;
  box-sizing: border-box;
`;

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

import { TownLeaderboardType, UserLeaderboardType } from 'hooks';

type Props = {
  townLeaderboard: TownLeaderboardType[];
  userLeaderboard: UserLeaderboardType[];
  isRanked: boolean;
};
export const LeaderboardTabs: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const [activeTabKey, setActiveTabKey] = useState<string>('town');
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
            key: 'town',
            buttonLabel: '지역',
            component: useCallback(
              () => (
                <DistrictLeaderboard
                  townLeaderboard={props.townLeaderboard}
                  isRanked={props.isRanked}
                />
              ),
              [props.isRanked, props.townLeaderboard]
            ),
          },
          {
            key: 'user',
            buttonLabel: '개인',
            component: useCallback(
              () => (
                <UserLeaderboard
                  userLeaderboard={props.userLeaderboard}
                  isRanked={props.isRanked}
                />
              ),
              [props.isRanked, props.userLeaderboard]
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
  height: 100%;
  overflow: auto;
  background: #ffffff;
  box-sizing: border-box;

  .swiper {
    height: calc(100% - 80px);
    max-height: calc(100% - 80px);
    padding: 0 16px;
  }

  .swiper-slide {
    height: fit-content;
    min-height: fit-content;
    width: 100%;
    padding: 14px 0;
    position: relative;
    border-bottom: 1px solid #ececec;
  }
`;

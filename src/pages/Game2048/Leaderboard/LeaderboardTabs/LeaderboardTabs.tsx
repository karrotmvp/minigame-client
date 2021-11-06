/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { Tabs } from '@karrotframe/tabs';
import '@karrotframe/tabs/index.css';
import { useCallback, useState } from 'react';
import { DistrictLeaderboard, IndividualLeaderboard } from './Leaderboard';

// const customizeTabs = css`
//   --kf_tabs_tabBar-borderColor: none;
//   --kf_tabs_tabBar-indicator-color: none;
//   --kf_tabs_tabBar-activeFontColor: hotpink !important;
// `;

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

export const LeaderboardTabs = () => {
  const { isTop } = useCurrentScreen();
  const [activeTabKey, setActiveTabKey] = useState<string>('district');
  const handleTabChange = (key: string) => {
    console.log(isTop);
    if (isTop) {
      setActiveTabKey(key);
    }
  };
  console.log('leaderboard tabs');
  return (
    <LeaderboardContainer>
      <Tabs
        // css={customizeTabs}
        // className={css`
        //   --kf_tabs_tabBar-borderColor: none;
        //   --kf_tabs_tabBar-indicator-color: none;
        //   --kf_tabs_tabBar-activeFontColor: hotpink;
        // `}
        activeTabKey={activeTabKey}
        tabs={[
          {
            key: 'district',
            buttonLabel: '지역 랭킹',
            component: useCallback(() => <DistrictLeaderboard />, []),
          },
          {
            key: 'individual',
            buttonLabel: '주민별',
            component: useCallback(() => <IndividualLeaderboard />, []),
          },
        ]}
        onTabChange={handleTabChange}
      />
    </LeaderboardContainer>
  );
};

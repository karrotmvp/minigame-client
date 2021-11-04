/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as WaitSvg } from '../assets/svg/wait.svg';
import { AppEjectionButton } from 'components/Button/NavigationButton';
import { Button, DisabledButton } from 'components/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { Analytics, useAnalytics } from 'services/analytics';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
// import { useKarrotMarketMini } from 'services/karrotMarketMini';
import useUserData from 'hooks/useUserData';
import {
  getMini,
  loadFromEnv as KarrotMiniPreset,
} from 'services/karrotMarket/mini';

const customNav = css`
  left: 0;
  width: 100%;
  // height: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;
const customNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
const backgroundStyle = css`
  background: #ffffff;
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: center;
  margin: auto;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  max-width: 400px;
`;
const svgStyle = css`
  // align-items: stretch;
`;
const mainText = css`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 161.7%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.02em;

  color: #3f3f3f;
  margin-bottom: 18px;
`;
const subText = css`
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #7c7c7c;
`;
const actionItemWraper = css`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  left: 0;
  right: 0;
  bottom: 0;

  text-align: center;
  width: 80%;
`;
const coloredText = css`
  color: #eb5d0e;
`;

interface NonServiceAreaProps {
  location: {
    state: {
      isNonServiceUserBack: boolean;
      districtName: string;
    };
  };
}

const NonServiceArea: React.FC<NonServiceAreaProps> = (props) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  // const karrotMarketMini = useKarrotMarketMini();
  const { userRegionId, onUpdateAccessToken } = useUserData();

  const trackUser = useCallback(
    async (
      karrotRaiseApi: KarrotRaiseApi,
      accessToken: string,
      analytics: Analytics
    ) => {
      try {
        const { data } = await karrotRaiseApi.getUserInfo(accessToken);
        if (data) {
          const { id } = data;
          analytics.setUserId(id);
          console.log('tracking non-service-area-user... id:', id);
        } else {
          throw new Error('response data from getUserInfo api is undefined');
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getAccessToken = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, code: string, regionId: string) => {
      try {
        if (code !== null) {
          const { data } = await karrotRaiseApi.postOauth2(code, regionId);
          if (data) {
            const { accessToken } = data;
            // window.localStorage.setItem('ACCESS_TOKEN', accessToken);
            onUpdateAccessToken(accessToken);
            return accessToken;
          }
        } else {
          throw new Error('Either code OR regionId is null');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateAccessToken]
  );

  const mini = getMini();
  const handleDemand = async function (
    karrotRaiseApi: KarrotRaiseApi,
    userRegionId: string,
    analytics: Analytics
  ) {
    analytics.logEvent('click_karrot_mini_preset', {
      user_type: 'non_service_area_user',
    });
    const presetUrl = KarrotMiniPreset().presetUrl;
    const appId = KarrotMiniPreset().appId;
    mini.startPreset({
      preset: presetUrl!,
      params: {
        appId: appId!,
      },
      onSuccess: async function (result: any) {
        if (result && result.code) {
          try {
            const accessToken = await getAccessToken(
              karrotRaiseApi,
              result.code,
              userRegionId
            );
            if (accessToken) {
              await trackUser(karrotRaiseApi, accessToken, analytics);
              const data = await karrotRaiseApi.postDemand(accessToken);
              if (data.success === true) {
                setIsClicked(true);
                analytics.logEvent('click_non_service_area_demand_button');
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    });
  };

  useEffect(() => {
    analytics.logEvent('view_non_service_area_page');
    if (props.location.state.isNonServiceUserBack === true) {
      setIsClicked(true);
    }
  }, [analytics, props.location.state.isNonServiceUserBack]);

  return (
    <>
      <div css={customNav}>
        <div css={customNavIcon}>
          <AppEjectionButton />
        </div>
      </div>
      <div css={backgroundStyle}>
        <WaitSvg css={svgStyle} />
        <h1 css={mainText}>
          <span css={coloredText}>{props.location.state.districtName}</span>
          지역은
          <br />
          아직 준비 중이에요
        </h1>
        <h2 css={subText}>
          <span css={coloredText}>오픈 알림</span>을 신청하시면
          <br />
          대회에 빠르게 참여하실 수 있어요!
        </h2>
      </div>
      <div css={actionItemWraper}>
        {isClicked ? (
          <DisabledButton size={`large`} text={`오픈 알림 신청 완료`} />
        ) : (
          <Button
            size={`medium`}
            color={`primary`}
            text={`오픈 알림 받기`}
            onClick={() =>
              handleDemand(karrotRaiseApi, userRegionId, analytics)
            }
          />
        )}
      </div>
    </>
  );
};

export default NonServiceArea;

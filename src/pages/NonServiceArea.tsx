/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as WaitSvg } from 'assets/wait.svg';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useAnalytics } from 'services/analytics';
import Button, { DisabledButton } from 'components/buttons/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import BackendApi from 'services/backendApi/backendApi';
import { getMini } from 'services/karrotmarket/mini';
import { trackUser } from 'services/firebase/trackUser';

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
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
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

const presetUrl = `${process.env.REACT_APP_MINI_PRESET}`;
const appId = `${process.env.REACT_APP_APP_ID}`;
const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const accessToken = `${window.localStorage.getItem('ACCESS_TOKEN')}`;
interface handleDemandTypes {
  preset: string;
  appId: string;
  baseUrl: string;
  accessToken: string;
}

interface NonServiceAreaProps {
  location: {
    state: {
      isNonServiceUserBack: boolean;
      townName: string;
    };
  };
}

const NonServiceArea: React.FC<NonServiceAreaProps> = (props) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { regionId } = useSelector((state: RootState) => ({
    regionId: state.userDataReducer.regionId,
  }));
  const analytics = useAnalytics();

  const getAccessToken = useCallback(
    async (code: string | null, regionId: string) => {
      if (code !== null) {
        const response = await BackendApi.postOauth2({
          code: code,
          regionId: regionId,
        });
        if (response.isFetched && response.data) {
          const { accessToken } = response.data.data;
          window.localStorage.setItem('ACCESS_TOKEN', accessToken);
        }
      } else {
        throw new Error('Either code OR regionId is null');
      }
    },
    []
  );

  const mini = getMini();
  const handleDemand = async ({
    preset,
    appId,
    baseUrl,
    accessToken,
  }: handleDemandTypes) => {
    mini.startPreset({
      preset: preset,
      params: {
        appId: appId,
      },
      onSuccess: async function (result) {
        if (result && result.code) {
          console.log();
          await getAccessToken(result.code, regionId);
          await trackUser();
          const response = await BackendApi.postDemand({
            baseUrl: baseUrl,
            accessToken: accessToken,
          });
          console.log(response);
          if (response.isFetched === true) {
            setIsClicked(true);
            analytics.logEvent('click_non_service_area_demand_button');
          }
        }
      },
      onFailure() {
        throw new Error('mini-app preset failed');
      },
    });
  };
  useEffect(() => {
    analytics.logEvent('view_non_service_area_page');
    if (props.location.state.isNonServiceUserBack === true) {
      setIsClicked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <span css={coloredText}>{props.location.state.townName}</span> 지역은
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
            onClick={() => {
              handleDemand({
                preset: presetUrl,
                appId: appId,
                baseUrl: baseUrl,
                accessToken: accessToken,
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default NonServiceArea;

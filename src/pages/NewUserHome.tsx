/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  emphasizedTextStyle,
  largeTextStyle,
  mediumTextStyle,
} from 'styles/textStyle';
import Button from '../components/buttons/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { getMini } from 'services/karrotmarket/mini';
import BackendApi from 'services/backendApi/backendApi';
import { useCallback } from 'react';

// nav
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
const divStyle = css`
  display: flex;
  flex-flow: column;
  height: calc(100% - 2.75rem);
`;
const headingWrapper = css`
  padding: 20px 26px 20px; ;
`;
const leaderboardWrapper = css`
  flex: 1;

  overflow: auto;
  padding: 0 26px;
`;
const actionItemWrapper = css`
  display: flex;
  justify-content: center;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const presetUrl: string = `${process.env.REACT_APP_MINI_PRESET}`;
const appId: string = `${process.env.REACT_APP_APP_ID}`;

const NewUserHome = () => {
  let history = useHistory();
  const { townName, regionId } = useSelector((state: RootState) => ({
    townName: state.userDataReducer.townName,
    regionId: state.userDataReducer.regionId,
  }));

  const getAccessToken = useCallback(
    async (code: string | null, regionId: string) => {
      if (code !== null) {
        const result = await BackendApi.postOauth2({
          code: code,
          regionId: regionId,
        });
        if (result.isFetched && result.data) {
          const { accessToken } = result.data.data;
          window.localStorage.setItem('ACCESS_TOKEN', accessToken);
        }
      } else {
        throw new Error('Either code OR regionId is null');
      }
    },
    []
  );

  const mini = getMini();
  const handleNewUserAgreement = (preset: string, appId: string) => {
    mini.startPreset({
      preset: preset,
      params: {
        appId: appId,
      },
      onSuccess: async function (result) {
        if (result && result.code) {
          await getAccessToken(result.code, regionId);
          history.push('/game');
          //   await BackendApi.postOauth2({
          //     code: result.code,
          //     regionId: regionId,
          //   }).then((response) => {
          //     const accessToken = response.data.accessToken;
          //     console.log('Access token generated (new-user): ', accessToken);
          //     window.localStorage.setItem('ACCESS_TOKEN', accessToken);
          //     history.push('/game');
          //   });
          // } catch (error) {
          //   console.error(error);
          // }
        }
      },
      onFailure() {
        throw new Error('mini-app preset failed');
      },
    });
  };

  return (
    <>
      <div css={customNav}>
        <div css={customNavIcon}>
          <AppEjectionButton />
        </div>
      </div>
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{townName} 이웃</span>님, 아직
            기록이 없어요
          </h1>
          <h2 css={mediumTextStyle}>
            당근을 수확하고 이웃들에게 한 마디 남겨봐요!
          </h2>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard />
        </div>
        <div css={actionItemWrapper}>
          <Button
            size={`large`}
            color={`primary`}
            text={`게임 시작`}
            onClick={() => {
              handleNewUserAgreement(presetUrl, appId);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NewUserHome;

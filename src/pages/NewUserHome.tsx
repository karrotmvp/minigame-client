/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  emphasizedTextStyle,
  largeTextStyle,
  mediumTextStyle,
} from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { getMini } from 'api/mini';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { useHistory } from 'react-router-dom';

const axios = require('axios').default;

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
const custonNavIcon = css`
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
  flex: 1;
  padding: 20px 26px 20px; ;
`;
const leaderboardWrapper = css`
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

const NewUserHome = () => {
  let history = useHistory();

  const mini = getMini();
  const handleNewUserAgreement = () => {
    mini.startPreset({
      preset:
        'https://mini-assets.kr.karrotmarket.com/presets/common-login/alpha.html',
      params: {
        appId: `${process.env.REACT_APP_APP_ID}`,
      },
      onSuccess: function (result) {
        if (result && result.code) {
          console.log(result);
          console.log(`code: ${result.code}`);
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/oauth`,
              {
                code: result.code,
                regionId: `9bdfe83b68f3`,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((response: any) => {
              window.localStorage.setItem(
                'ACCESS_TOKEN',
                response.data[`data`][`accessToken`]
              );
              console.log(response);
              history.push('/game');
            });
        }
      },
    });
  };

  return (
    <>
      <div css={customNav}>
        <div css={custonNavIcon}>
          <AppEjectionButton />
        </div>
      </div>
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>서초구 이웃</span>님, 아직 기록이
            없어요
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
            text={`시작하기`}
            onClick={handleNewUserAgreement}
          />
        </div>
      </div>
    </>
  );
};

export default NewUserHome;

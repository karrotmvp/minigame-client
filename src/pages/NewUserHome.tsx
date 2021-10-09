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
import BackendService from 'services/backendService';

const divStyle = css`
  display: flex;
  flex-flow: column;
  height: 100%;
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
  const mini = getMini();
  const appId = process.env.REACT_APP_APP_ID;
  const handleNewUserAgreement = () => {
    mini.startPreset({
      preset:
        'https://mini-assets.kr.karrotmarket.com/presets/common-login/alpha.html',
      params: {
        appId: `${appId}`,
      },
      onSuccess: function (result) {
        if (result && result.code) {
          console.log(result);
          console.log(`code: ${result.code}`);
          BackendService.postOauth(result.code, `9bdfe83b68f3`).then(
            (data: any) => console.log(data)
          );
        }
      },
    });
  };

  return (
    <>
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
            size={`fullWidth`}
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

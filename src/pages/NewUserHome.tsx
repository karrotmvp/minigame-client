/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  emphasizedTextStyle,
  largeTextStyle,
  mediumTextStyle,
} from 'styles/textStyle';
import Button from '../components/buttons/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { getMini } from 'api/mini';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useHistory } from 'react-router-dom';
// import BackendService from 'services/backendService';
// import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from 'services/firebase/firebaseConfig';
import { SetStateAction, useEffect, useState } from 'react';
import BackendService from 'services/backendService';

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

// interface NewUserHometype {
//   setIsNewUser: React.Dispatch<SetStateAction<boolean | undefined>>;
// }
const NewUserHome = () => {
  // const [userData, setUserData] = useState(initialState);
  let history = useHistory();

  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  const mini = getMini();
  const handleNewUserAgreement = () => {
    mini.startPreset({
      preset:
        'https://mini-assets.kr.karrotmarket.com/presets/common-login/alpha.html',
      params: {
        appId: `${process.env.REACT_APP_APP_ID}`,
      },
      onSuccess: function (result) {
        console.log(window.location.search);
        if (result && result.code) {
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/oauth`,
              {
                code: result.code,
                regionId: userRegionId,
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
              // await getCurrentuserInfo().then(data => {
              //   setUserData({
              //     nickname: data[`nickname`],
              //     score: data[`score`],
              //     rank: data[`rank`],
              //     comment: data[`comment`],
              //   });
              // })
              // console.log(response);
              // setIsNewUser(false);
              // console.log('preset fired');
              history.push('/game');
            });
        }
      },
    });
  };
  let userRegionId: string | null;
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    // const userCode = searchParams.get('code');
    userRegionId = searchParams.get('region_id');
    console.log(userRegionId);
  });
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

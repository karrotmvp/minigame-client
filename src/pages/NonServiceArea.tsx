/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { logEvent } from '@firebase/analytics';
import { ReactComponent as WaitSvg } from 'assets/wait.svg';
import axios from 'axios';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import Button, { DisabledButton } from 'components/buttons/Button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { analytics } from 'services/firebase/firebaseConfig';
import { getMini } from 'services/karrotmarket/mini';

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
interface NonServiceAreaProps {
  location: any;
}
// const baseUrl = process.env.REACT_APP_BASE_URL;

const NonServiceArea = (props: NonServiceAreaProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { regionId } = useSelector((state: RootState) => ({
    // townName: state.userDataReducer.townName,
    regionId: state.userDataReducer.regionId,
  }));

  // async function getAccessToken({
  //   code,
  //   regionId,
  // }: BackendServiceRequest): Promise<void> {
  //   const { data } = await axios.post(
  //     `${baseUrl}/oauth`,
  //     { code: code, regionId: regionId },

  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );
  //   const { accessToken } = await data.data;
  //   return window.localStorage.setItem('ACCESS_TOKEN', accessToken);
  // }

  // async function postDemand(accessToken: any) {
  //   await axios.post(`${process.env.REACT_APP_BASE_URL}/demand`, {
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   });
  // }

  async function handleDemand() {
    const mini = getMini();
    mini.startPreset({
      preset: `${process.env.REACT_APP_MINI_PRESET}`,
      params: {
        appId: `${process.env.REACT_APP_APP_ID}`,
      },
      onSuccess: function (result) {
        if (result && result.code) {
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/oauth`,
              {
                code: result.code,
                regionId: regionId,
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
                response.data.data.accessToken
              );
            })
            .then(() => {
              console.log(window.localStorage.getItem('ACCESS_TOKEN'));
              axios
                .post(`${process.env.REACT_APP_BASE_URL}/demand`, null, {
                  headers: {
                    Authorization: `${window.localStorage.getItem(
                      'ACCESS_TOKEN'
                    )}`,
                    'Content-Type': 'application/json',
                  },
                })
                .then((response) => {
                  console.log('xxxxx', response);
                  setIsClicked(true);
                })
                .catch((error) => {
                  console.log(error.response);
                  if (error.response.status === 400) {
                    setIsClicked(true);
                  }
                });
            });
        }
      },
    });
  }
  useEffect(() => {
    if (props.location.state.nonServiceUserBack === true) {
      setIsClicked(true);
    }
    logEvent(analytics, 'non_service_area');
    console.log('non service area');
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
            onClick={handleDemand}
          />
        )}
      </div>
    </>
  );
};

export default NonServiceArea;

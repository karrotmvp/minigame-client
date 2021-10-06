/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import { sampleUserData } from 'sampleUserData';
import { largeTextStyle, mediumTextStyle } from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/IndividualLeaderboard';
import { getMini } from 'api/mini';

const divStyle = css`
  padding: 20px 26px 0px;
`;

interface NewUserHomeProps {
  setIsNewUser: any;
}
const NewUserHome = ({ setIsNewUser }: NewUserHomeProps) => {
  const { push } = useNavigator();
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
          setIsNewUser(false);
          push('/game');
        }
      },
    });
  };
  return (
    <div>
      <ScreenHelmet title="홈" closeButtonLocation="right" />
      <div css={divStyle}>
        <h1 css={largeTextStyle}>강남구 이웃님! 아직 기록이 없어요</h1>
        <h2 css={mediumTextStyle}>당근 키우기를 이웃들과 함께해요!</h2>
        <IndividualLeaderboard userData={sampleUserData} />
      </div>
      <Button
        size={`fullWidth`}
        color={`primary`}
        position={`bottom`}
        text={`시작하기`}
        onClick={handleNewUserAgreement}
      />
    </div>
  );
};

export default NewUserHome;

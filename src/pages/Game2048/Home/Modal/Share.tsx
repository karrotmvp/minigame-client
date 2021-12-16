import styled from '@emotion/styled';
import { useAccessToken, useMini, useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import React, { useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { ReactComponent as ImageTownScoreExample } from 'assets/images/svg/image_town_score_example.svg';
import { ReactComponent as ImageGlitter } from 'assets/images/svg/image_glitter.svg';
import { rem } from 'polished';
import { useCurrentScreen } from '@karrotframe/navigator';
interface Props {
  setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRanked?: boolean;
}

export const Share: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const { accessToken } = useAccessToken();
  const analytics = useAnalytics();
  const { shareApp, handleThirdPartyAgreement } = useMini();
  const { user } = useUser();
  const { rank } = useMyGame2048Data();
  // Share handler
  // =================================================================
  const runShareOnSuccess = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      location: 'home_page',
      game_type: '2048_puzzle',
      button_type: 'share_button',
    });
    handleShare();
  };
  const handleShare = () => {
    analytics.logEvent('click_share_button', {
      location: 'home_page',
      game_type: '2048_puzzle',
    });
    const url = 'https://daangn.onelink.me/HhUa/37719e67';
    const text = props.isRanked
      ? `${user.nickname}님은 2048 퍼즐에서 전국 ${rank}등!`
      : `${user.nickname}님이 이웃님을 동네대회에 초대했어요! 같이 게임할래요?`;
    shareApp(url, text);
  };

  const triggerShareHandler = () => {
    if (accessToken) {
      handleShare();
    } else {
      handleThirdPartyAgreement(runShareOnSuccess);
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_share_modal', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  return (
    <ModalContainer>
      <ImageGlitter
        style={{
          position: 'absolute',
          inset: '-70px 0 auto',
          margin: 'auto',
        }}
      />

      <MainText>
        <span className="highlight">{user.nickname}</span>님,
        <br />
        친구를 초대해
        <br />
        우리 동네 순위를 올려봐요 🔥
      </MainText>
      <Example>
        <ImageTownScoreExample className="image" />
        <p className="text">동네 점수는 동네 이웃 점수의 합이에요</p>
      </Example>

      <ShareButton onClick={triggerShareHandler}>
        동네 친구 초대하기
      </ShareButton>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  width: 80%;
  height: fit-content;
  background: #fff;
  border-radius: 10px;
  padding: 20px 18px;
  position: relative;
`;
const MainText = styled.h3`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(18)};
  line-height: 161.7%;
  text-align: center;
  color: #0e74ff;

  .highlight {
    font-weight: bold;
    font-size: ${rem(18)};
    color: #ec9c00;
  }
`;

const Example = styled.div`
  margin: 20px 0 16px;
  width: 100%;

  .image {
    width: 100%;
    height: 100%;
  }
  .text {
    font-size: ${rem(12)};
    line-height: 161.7%;
    text-align: center;
    color: #7c7c7c;

    margin-top: 14px;
  }
`;

const ShareButton = styled.button`
  width: 100%;
  background: #0e74ff;
  border-radius: 10px;
  box-shadow: 0px 4px 0px 0px #1457ae;
  padding-top: 6px;
  padding-bottom: 6px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #ffffff;
`;

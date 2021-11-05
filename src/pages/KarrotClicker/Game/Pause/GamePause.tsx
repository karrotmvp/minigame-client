/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { commafy } from 'utils/functions/numberFunctions';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { Analytics, useAnalytics } from 'services/analytics';
import useUserData from 'hooks/useUserData';
import useClickCounter from 'hooks/useClickCounter';
import { getMini } from 'services/karrotMarket/mini';
import { OldButton } from 'components/Button';
import { TopRank } from '../GameOver';
import { useNavigator } from '@karrotframe/navigator';

const modalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: #fff;
  // top: 25px;
  // inset: 10% 8% 10%;
  padding: 45px 15px 20px;
  border-radius: 21px;
`;
const largeText = css`
  margin: 15px 0;
`;
const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 0.1px solid #e7e7e7;
  // padding: 0;
`;
const totalKarrotText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #a9a9a9;

  margin: 15px 0 23px;
`;

// const initialState = {
//   nickname: '',
//   score: 0,
//   rank: 100,
//   comment: '',
// };

type UserData = {
  nickname: string;
  score: number;
  rank: number;
  comment: string;
};
Modal.setAppElement(document.createElement('div'));

interface GamePauseProps {
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}
export const GamePause: React.FC<GamePauseProps> = (props) => {
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  const { push } = useNavigator();
  const { clickCount } = useClickCounter();
  const {
    accessToken,
    userId,
    userNickname,
    userScore,
    userRank,
    userComment,
    onUpdateUserData,
  } = useUserData();
  const [userData, setUserData] = useState<UserData>({
    nickname: userNickname,
    score: userScore,
    rank: userRank,
    comment: userComment,
  });
  const [modalIsOpen, setIsOpen] = useState(false);

  // Page navigation
  const goToLeaderboardPage = () => {
    push(`/karrot-clicker/leaderboard`);
  };

  // Button handler
  const handleContinue = () => {
    analytics.logEvent('click_game_continue_button');
    props.setIsPaused(false);
  };

  const handleGameEnd = async (
    karrotRaiseApi: KarrotRaiseApi,
    accessToken: string,
    clickCount: number,
    analytics: Analytics
  ) => {
    // bypass in web environment
    console.log('mini environment check,', getMini().environment);
    if (getMini().environment === 'Web') {
      props.setIsPaused(false);
      goToLeaderboardPage();
      return null;
    }
    try {
      console.log(clickCount);
      analytics.logEvent('click_game_end_button', { score: clickCount });
      const { status } = await karrotRaiseApi.patchUserScore(
        accessToken,
        clickCount
      );
      if (status === 200) {
        const { data } = await karrotRaiseApi.getUserInfo(accessToken);
        if (data) {
          const { nickname, score, rank, comment } = data;
          onUpdateUserData(userId, nickname, score, rank, comment);
          setUserData({
            nickname: nickname,
            score: score,
            rank: rank,
            comment: comment,
          });
          if (rank <= 10) {
            setIsOpen(true);
          } else {
            goToLeaderboardPage();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Karrot />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={emphasizedTextStyle}>{commafy(clickCount)}개</span>
        의 당근을
        <br />
        수확했어요!
      </h1>
      <hr css={horizontalLine} />
      <p css={totalKarrotText}>총 당근 {commafy(userScore + clickCount)}개</p>
      <div
        style={{
          width: `100%`,
          display: `flex`,

          flex: '0 1 40px',
          justifyContent: `space-evenly`,
          gap: '10px',
        }}
      >
        <OldButton
          size={`medium`}
          color={`secondary`}
          text={`계속하기`}
          onClick={handleContinue}
        />
        <OldButton
          size={`medium`}
          color={`primary`}
          text={`게임종료`}
          onClick={() =>
            handleGameEnd(karrotRaiseApi, accessToken, clickCount, analytics)
          }
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Top-User Game End Modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0)',
            zIndex: 100,
          },
        }}
      >
        <TopRank rank={userData.rank} comment={userData.comment} />
      </Modal>
    </>
  );
};

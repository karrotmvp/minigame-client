/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { commafy } from 'utils/functions/numberFunctions';
import useClickCounter from 'pages/KarrotClicker/hooks/useClickCounter';
import { OldButton } from 'components/Button';
import { CommentModal } from './CommentModal';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini } from 'hooks';

// Modal.setAppElement(document.createElement('div'));

type Props = {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
};
export const GameOver: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { push } = useNavigator();
  const { isInWebEnvironment } = useMini();
  const { clickCount } = useClickCounter();
  const { gameType, score, rank, comment, updateMyKarrotClickerData } =
    useMyKarrotClickerData();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);

  // Page navigation
  const goToLeaderboardPage = () => {
    push(`/karrot-clicker/leaderboard`);
  };

  const handleViewLeaderboard = async () => {
    if (isInWebEnvironment) {
      console.log(
        'bypass in web environment: game-pause-modal to leaderboard-page'
      );
      props.setIsGameOver(false);
      goToLeaderboardPage();
    }
    await minigameApi.gamePlayApi.updateScoreUsingPATCH(gameType, {
      score: clickCount,
    });
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
    if (data) {
      updateMyKarrotClickerData(data.score, data.rank, data.comment);
      if (data.rank <= 10) {
        // close game-over-modal
        props.setIsGameOver(false);
        // open-comment-modal
        setShouldModalOpen(true);
      } else {
        // close-game-over-modal
        props.setIsGameOver(false);
        //
        goToLeaderboardPage();
      }
    } else {
      // handle what if response data from db deson't exist?
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
      <p css={totalKarrotText}>총 당근 {commafy(score! + clickCount)}개</p>
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
          color={`primary`}
          text={`랭킹보기`}
          onClick={handleViewLeaderboard}
        />
      </div>
      <ReactModal
        isOpen={shouldModalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Comment modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0)',
            zIndex: 100,
          },
        }}
      >
        <CommentModal
          rank={rank}
          comment={comment}
          setShouldModalOpen={setShouldModalOpen}
        />
      </ReactModal>
    </>
  );
};

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

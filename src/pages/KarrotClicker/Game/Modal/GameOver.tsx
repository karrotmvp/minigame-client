/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { commafy } from 'utils/functions/numberFunctions';
import { useAnalytics } from 'services/analytics';
import { OldButton } from 'components/Button';
import { CommentModal } from './CommentModal';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini } from 'hooks';
import { useGame } from '../hooks';

ReactModal.setAppElement(document.createElement('div'));

type Props = {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
};
export const GameOver: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { replace } = useNavigator();
  const { isInWebEnvironment } = useMini();
  const { clickCount, shouldPause } = useGame();
  const { score, updateMyKarrotClickerData } = useMyKarrotClickerData();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);

  // Page navigation
  const goToLeaderboardPage = () => {
    replace(`/karrot-clicker/leaderboard`);
  };

  const handleViewLeaderboard = async () => {
    if (isInWebEnvironment) {
      console.log(
        'bypass in web environment: game-pause-modal to leaderboard-page'
      );
      props.setIsGameOver(false);
      goToLeaderboardPage();
    }
    try {
      await minigameApi.gamePlayApi.updateScoreUsingPATCH('GAME_KARROT', {
        score: clickCount,
      });
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
      if (data) {
        if (data.score && data.rank) {
          updateMyKarrotClickerData(data.score, data.rank);
          if (data.rank <= 10 && data.rank > 0) {
            analytics.logEvent('click_game_end_button', {
              game_type: 'karrot-clicker',
              score: clickCount,
              rank: data.rank,
              is_top_user: true,
              button_type: 'game_over',
            });
            console.log('comment modal should open');
            // open-comment-modal
            setShouldModalOpen(true);
          } else {
            analytics.logEvent('click_game_end_button', {
              game_type: 'karrot-clicker',
              score: clickCount,
              rank: data.rank,
              is_top_user: false,
              button_type: 'game_over',
            });
            // close-game-over-modal
            goToLeaderboardPage();
          }
        } else {
          // handle what if response data from db deson't exist?
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isTop) {
      shouldPause(true);
      analytics.logEvent('view_game_over_modal', {
        game_type: 'karrot-clicker',
      });
    }
  }, [analytics, isTop, shouldPause]);
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
          // rank={rank}
          // comment={comment}
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

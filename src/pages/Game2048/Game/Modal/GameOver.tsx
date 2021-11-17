import { useNavigator } from '@karrotframe/navigator';
import styled from '@emotion/styled';
// import { useMini } from 'hooks';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { PostComment } from './PostComment';
import { ReactComponent as GameOverSVG } from 'assets/svg/game2048/gameover.svg';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
type Props = {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  currentScore: number;
  myBestScore: number;
  // isUserInTopTen: boolean;
};
export const GameOver: React.FC<Props> = (props) => {
  const { replace } = useNavigator();
  const minigameApi = useMinigameApi();
  const { rank, gameType, updateMyScore } = useMyGame2048Data();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);
  // const shouldOpen = useRef(false);
  const goToLeaderboardPage = () => {
    replace(`/game-2048/leaderboard`);
  };

  // const getMyData = async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);

  //   if (data) {
  //     if (data.comment) {
  //       updateMyComment(data.comment);
  //     }
  //     if (data.score && data.rank) {
  //       updateMyScore(data.score, data.rank);

  //       return data.rank;
  //     }
  //   }
  // };

  const handleViewLeaderboard = async () => {
    console.log('try to view leaderboard');
    // console.log(props.isUserInTopTen);
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);

      if (data) {
        // if (data.comment) {
        //   updateMyComment(data.comment);
        // }
        if (data.score && data.rank) {
          updateMyScore(data.score, data.rank);
          if (data.rank > 0 && data.rank <= 10) {
            // props.setIsGameOver(false);
            setShouldModalOpen(true);
          } else {
            // props.setIsGameOver(false);
            // setShouldModalOpen(true);
            goToLeaderboardPage();
          }
          // return data.rank;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // console.log(newRank);
    // if (newRank) {
    //   if (newRank > 0 && newRank <= 10) {
    //     // setIsUserInTopTen(true);
    //     props.setIsGameOver(false);
    //     setShouldOpen(true);
    //   } else {
    //     // setIsUserInTopTen(false);
    //     props.setIsGameOver(false);
    //     setShouldOpen(false);
    //     goToLeaderboardPage();
    //   }
    //   // }
    // }

    // if (props.isUserInTopTen) {
    //   setShouldOpen(true);
    //   console.log(shouldOpen);

    //   props.setIsGameOver(false);
    // } else {
    //   props.setIsGameOver(false);
    //   goToLeaderboardPage();
    // }
  };

  return (
    <>
      <GameOverSVG />
      <Text>최종 스코어</Text>
      <p>{rank}</p>
      <Score>{props.currentScore}</Score>
      <Button
        size={`large`}
        fontSize={`16`}
        color={`primary`}
        onClick={handleViewLeaderboard}
      >
        랭킹보기
      </Button>

      <ReactModal
        // isOpen={shouldOpen.current}
        isOpen={shouldModalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Post Comment"
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
          content: {
            height: `fit-content`,
            width: `80%`,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: `21px`,
            padding: `24px 18px`,
            display: `flex`,
            flexFlow: `column`,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        {/* <PostComment shouldOpen={shouldOpen} /> */}
        <PostComment setShouldModalOpen={setShouldModalOpen} />
      </ReactModal>
    </>
  );
};

const Text = styled.p`
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  /* gray/gray 100 */

  color: #f5f5f5;
`;
const Score = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 103.7%;
  /* or 31px */

  text-align: center;

  /* basic/white */

  color: #ffffff;
`;

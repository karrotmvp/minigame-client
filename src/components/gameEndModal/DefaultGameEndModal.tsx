/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button from '../Button';
import { ReactComponent as Karrot } from 'assets/karrot.svg';
import TopUserGameEndModal from './TopUserGameEndModal';
import { useNavigator } from '@karrotframe/navigator';
import { Route, useHistory } from 'react-router';
import BackendService from 'services/backendService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import Modal from 'react-modal';
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

const initialState = {
  nickname: '',
  score: 0,
  rank: 0,
  comment: '',
};

interface DefaultGameEndModalProps {
  closeModal: () => void;
  // score: number;
  // currentRank: number;
}
const DefaultGameEndModal = ({ closeModal }: DefaultGameEndModalProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(initialState);

  // const { push } = useNavigator();
  let history = useHistory();

  const { karrotCount } = useSelector((state: RootState) => ({
    karrotCount: state.counterReducer.karrotCount,
  }));

  const handleViewLeaderboard = () => {
    // push('/leaderboard');
    history.push('/leaderboard');
  };

  const handleTopUserCommentModal = () => {
    // push('game/modal/top-user');
  };
  const handleCloseModal = () => {};
  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      return responseData;
    } catch (error) {
      console.error(`getCurrentUserInfo: ${error}`);
    }
  };

  useEffect(() => {
    getCurrentuserInfo().then((data) => {
      setUserData({
        nickname: data[`nickname`],
        score: data[`score`],
        rank: data[`rank`],
        comment: data[`comment`],
      });
    });
  }, []);

  return (
    <>
      <Karrot />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={emphasizedTextStyle}>{karrotCount}개</span>의 당근을
        <br />
        수확했어요!
      </h1>
      {/* <div style={{ flex: '1' }}></div> */}
      <hr css={horizontalLine} />
      <p css={totalKarrotText}>총 당근 {userData.score}개</p>
      <div
        style={{
          width: `100%`,
          display: `flex`,

          flex: '0 1 40px',
          justifyContent: `space-evenly`,
          gap: '10px',
        }}
      >
        <Button
          size={`medium`}
          color={`secondary`}
          text={`이어하기`}
          onClick={closeModal}
        />
        <Button
          size={`medium`}
          color={`primary`}
          text={`랭킹보기`}
          onClick={() => {
            if (userData.rank <= 10) {
              setIsOpen(true);
            } else {
              handleViewLeaderboard();
            }
          }}
        />
      </div>
      {/* <Route path="/game/modal/top-user">
        <TopUserGameEndModal
          handleViewLeaderboard={handleViewLeaderboard}
          // score={score}
          currentRank={userData.rank}
        />
      </Route> */}
      <Modal
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Top-User Game End Modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
          },
        }}
      >
        <TopUserGameEndModal />
      </Modal>
    </>
  );
};

export default DefaultGameEndModal;

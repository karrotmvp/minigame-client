/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigator } from '@karrotframe/navigator';
import IconClose from 'assets/IconClose';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import IndividualLeaderboard from './IndividualLeaderboard';
import { sampleUserData } from 'sampleUserData';
import Button from './Button';

interface CloseButtonProps {
  handleClose: () => void;
}
const CloseButton = ({ handleClose }: CloseButtonProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      onClick={handleClose}
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <IconClose />
    </a>
  );
};

const modalStyle = css`
  position: absolute;
  background: #fff;
  top: 25px;
  inset: 10% 8% 10%;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  overflow: scroll;
`;
interface GameEndModalProps {
  handleCloseModal: () => void;
  score: number;
}
const GameEndModal = ({ handleCloseModal, score }: GameEndModalProps) => {
  const { push } = useNavigator();

  const handleViewLeaderboard = () => {
    push('/leaderboard');
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 10, .5)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div css={modalStyle}>
        <CloseButton handleClose={handleCloseModal} />
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            height: '95%',
          }}
        >
          <h1
            css={largeTextStyle}
            style={{ textAlign: 'center', flex: '0 1 auto' }}
          >
            <span css={emphasizedTextStyle}>{score}개</span>의 당근을
            <br />
            수확했어요!
          </h1>
          <div style={{ flex: '1' }}></div>
          <div
            style={{
              width: `100%`,
              display: `flex`,

              flex: '0 1 40px',
              justifyContent: `space-evenly`,
              paddingTop: `20px`,
              gap: '10px',
            }}
          >
            <Button
              size={`medium`}
              color={``}
              position={null}
              text={`계속하기`}
              onClick={handleCloseModal}
            />
            <Button
              size={`medium`}
              color={`primary`}
              position={null}
              text={`랭킹보기`}
              onClick={handleViewLeaderboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;

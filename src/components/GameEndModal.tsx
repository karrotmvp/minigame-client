/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigator } from '@karrotframe/navigator';
import IconClose from 'assets/IconClose';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import IndividualLeaderboard from './IndividualLeaderboard';
import { sampleUserData } from 'sampleUserData';
import Button from './Button';
import { NONAME } from 'dns';

interface CloseButtonProps {
  handleClose: () => void;
}
const CloseButton = ({ handleClose }: CloseButtonProps) => {
  return (
    <a onClick={handleClose}>
      <IconClose />
    </a>
  );
};

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
      <div
        style={{
          position: 'absolute',
          background: '#fff',
          top: '25px',

          inset: '10% 8% 10%',
          padding: 15,
          borderRadius: '10px',
        }}
      >
        <CloseButton handleClose={handleCloseModal} />
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          <h1 css={largeTextStyle} style={{ textAlign: 'center' }}>
            <span css={emphasizedTextStyle}>{score}개</span>의 당근을
            <br />
            수확했어요!
          </h1>
          <IndividualLeaderboard userData={sampleUserData} />
          <div
            style={{
              width: `100%`,
              display: `flex`,
              justifyContent: `space-evenly`,
              padding: `20px 0`,
            }}
          >
            <Button
              size={`medium`}
              position={null}
              text={`계속하기`}
              onClick={handleCloseModal}
            />
            <Button
              size={`medium`}
              position={null}
              text={`기록보기`}
              onClick={handleViewLeaderboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;

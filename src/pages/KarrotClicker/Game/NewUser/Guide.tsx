/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCurrentScreen } from '@karrotframe/navigator';
import { ReactComponent as PointingFinger } from 'assets/svg/KarrotClicker/pointing_finger.svg';
import { OldButton } from 'components/Button/Button';
import { useUser } from 'hooks';
import { useEffect } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import { useGame } from '../hooks';

const directionText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* or 23px */

  text-align: center;

  color: #ffffff;
`;

type Props = {
  setIsUserNew: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Guide: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { setUser } = useUser();
  const { updateAnimationPlayState } = useGame();

  const updateUserInfo = async () => {
    const {
      data: { data },
    } = await minigameApi.userApi.getUserInfoUsingGET();
    if (data) {
      setUser({ id: { userId: data.id }, nickname: data.nickname });
    }
  };

  const handleCloseGuide = () => {
    updateUserInfo();
    props.setIsUserNew(false);
    updateAnimationPlayState('running');
  };

  useEffect(() => {
    if (isTop) {
      updateAnimationPlayState('paused');
    }
  }, [isTop, updateAnimationPlayState]);

  return (
    <>
      <PointingFinger />
      <p css={directionText}>
        점점 작아지는 당근을 터치해
        <br />
        당근을 모아보세요!
        <br />
        계속 터치하면 당근은
        <br />
        작아지지 않아요
      </p>
      <OldButton
        size={`medium`}
        color={`secondary`}
        text={`게임 시작하기`}
        onClick={handleCloseGuide}
      />
    </>
  );
};

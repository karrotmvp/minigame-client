import styled from '@emotion/styled';
import BadgeUrl from 'assets/svg/game2048/top_badge.svg';

export const VeryFirstWeekDistrict: React.FC = () => {
  return (
    <Container>
      <p>
        첫 <span>1등 동네</span>가<br />
        되어 보세요!
      </p>
    </Container>
  );
};

export const VeryFirstWeekTownie: React.FC = () => {
  return (
    <Container>
      <p>
        첫 <span>전국 1등</span>이<br />
        되어 보세요!
      </p>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  height: 112px;
  width: 100%;
  // padding: 40px 40px 32px;

  box-sizing: border-box;
  background: #f3f8ff;
  border: 1px solid #5ba1ff;
  border-radius: 10px;

  position: relative;
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 142.7%;
    /* or 20px */

    text-align: center;

    color: #0e74ff;

    span {
      font-weight: 600;
      font-size: 14px;
      color: #ec9c00;
    }
  }

  &::before {
    content: '';
    background-image: url(${BadgeUrl});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 23px;
    height: 31px;
    position: absolute;
    top: -11px;
    left: 17px;
  }
`;

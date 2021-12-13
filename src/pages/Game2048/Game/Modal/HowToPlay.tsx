import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Navigation } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/modules/pagination/pagination.scss';
import { ReactComponent as HowToPlay1 } from 'assets/svg/game2048/how_to_play_1.svg';
import { rem } from 'polished';

interface Props {
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HowToPlay: React.FC<Props> = (props) => {
  const [isLastSlide, setIsLastSlide] = useState<boolean>(false);

  useEffect(() => {
    console.log(isLastSlide);
  }, [isLastSlide]);
  return (
    <>
      <div
        style={{
          background: '#E3EFFF',
          borderRadius: '10px',
          padding: '0 14px',
          margin: '30px 0 6px',
        }}
      >
        <p
          style={{
            color: '#0E74FF',
            fontSize: `${rem(24)}`,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            lineHeight: '161.7%',
          }}
        >
          2048
        </p>
      </div>
      <p
        style={{
          color: '#0E74FF',
          fontWeight: 'bold',
          fontSize: `${rem(18)}`,
          lineHeight: `160.2%`,
        }}
      >
        처음 해보시나요?
      </p>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        watchSlidesProgress={true}
        className="mySwiper"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay1 />
            </div>

            <p className="text">
              손가락으로 밀어서
              <br />
              같은 숫자끼리 합쳐요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay1 />
            </div>

            <p className="text">
              합친 숫자만큼
              <br />
              점수가 올라가요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay1 />
            </div>

            <p className="text">
              손가락으로 밀어서
              <br />
              같은 숫자끼리 합쳐요
            </p>
          </Container>
          {({ isVisible }) => setIsLastSlide(() => isVisible)}
          {({ isActive }) => (
            <div>Current slide is {isActive ? 'active' : 'not active'}</div>
          )}
        </SwiperSlide>
        <div
          style={{
            margin: '22px 18px',
          }}
        >
          <button
            style={{
              width: '100%',
              boxShadow: `0px 6px 0px 0px #1457AE`,
              background: `#0E74FF`,
              padding: `6px 0`,
              borderRadius: `10px`,
              fontWeight: `bold`,
              fontSize: `${rem(14)}`,
              lineHeight: `161.7%`,
              color: `#FFFFFF`,
            }}
            onClick={() => props.setShowHowToPlay(false)}
          >
            {isLastSlide ? '게임 시작!' : '건너뛰기'}
          </button>
        </div>
      </Swiper>
    </>
  );
};

const Container = styled.div`
  height: fit-content;
  text-align: center;
  .image {
    background: #f3f8ff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 38px;
    margin: 20px 0;
  }
  .text {
    font-size: ${rem(14)};
    line-height: 161.7%;
    color: #5b5b5b;
  }
`;

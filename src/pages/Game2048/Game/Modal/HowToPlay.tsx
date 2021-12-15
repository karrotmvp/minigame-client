import React from 'react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/modules/pagination/pagination.scss';
import { ReactComponent as HowToPlay1 } from 'assets/svg/game2048/how_to_play_1.svg';
import { ReactComponent as HowToPlay2 } from 'assets/svg/game2048/how_to_play_2.svg';
import { ReactComponent as HowToPlay3 } from 'assets/svg/game2048/how_to_play_3.svg';

import { rem } from 'polished';
import './swiperStyles.scss';

interface Props {
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HowToPlay: React.FC<Props> = (props) => {
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
        게임방법
      </p>
      <Swiper
        modules={[Pagination, Autoplay]}
        centeredSlides={true}
        loop={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
        style={{
          width: '100%',
          height: '280px',
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
              <span className="text--blue">같은 숫자끼리 합쳐요</span>
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay2 />
            </div>
            <p className="text">
              <span className="text--blue">합친 숫자만큼</span>
              <br />
              점수가 올라가요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay3 />
            </div>
            <p className="text">
              점수를 높여서 최고기록을 세우고,
              <br />
              <span className="text--blue">우리 동네도 1등</span>으로
              만들어봐요!
            </p>
          </Container>
        </SwiperSlide>
      </Swiper>
      <div
        style={{
          width: '100%',
          padding: '22px 18px',
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
          건너뛰기
        </button>
      </div>
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
    height: 140px;
  }
  .text {
    font-size: ${rem(14)};
    line-height: 161.7%;
    color: #5b5b5b;

    .text--blue {
      font-size: ${rem(14)};
      line-height: 161.7%;
      color: #0e74ff;
    }
  }
`;

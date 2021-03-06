import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/modules/pagination/pagination.scss';
import { ReactComponent as HowToPlay1 } from 'assets/svg/game2048/how_to_play_1.svg';
import { ReactComponent as HowToPlay2 } from 'assets/svg/game2048/how_to_play_2.svg';
import { ReactComponent as HowToPlay3 } from 'assets/svg/game2048/how_to_play_3.svg';
import { ReactComponent as HowToPlay4 } from 'assets/svg/game2048/how_to_play_4.svg';
import { ReactComponent as HowToPlay5 } from 'assets/svg/game2048/how_to_play_5.svg';
import { rem } from 'polished';
import { useHistory } from 'react-router';

interface Props {
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HowToPlay: React.FC<Props> = (props) => {
  const history = useHistory();

  useEffect(() => {
    const unblock = history.block((location, action) => {
      if (action === 'POP') {
        props.setShowHowToPlay(false);
        return false;
      }
      return undefined;
    });
    return () => unblock();
  }, [history, props]);

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
            fontSize: `${rem(28)}`,
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
          fontFamily: 'Cafe24Ssurround',
          fontWeight: 'bold',
          fontSize: `${rem(18)}`,
          lineHeight: `160.2%`,
        }}
      >
        게임방법
      </p>
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          stopOnLastSlide: true,
        }}
        loop={false}
        pagination={{
          clickable: true,
        }}
        watchSlidesProgress={true}
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
              화면을 밀어서
              <br />
              숫자 타일을 움직여요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay2 />
            </div>
            <p className="text">
              같은 타일끼리 만나면
              <br />
              합쳐져요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay3 />
            </div>
            <p className="text">
              합쳐진 숫자만큼
              <br />
              점수가 올라요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay4 />
            </div>
            <p className="text">
              타일이 움직일 때 마다
              <br />
              새로운 숫자 타일이 생겨요
            </p>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container>
            <div className="image">
              <HowToPlay5 />
            </div>
            <p className="text">
              더 이상 타일을 합칠 수 없으면
              <br />
              게임 오버!
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
          게임 시작
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
    font-size: ${rem(16)};
    line-height: 161.7%;
    color: #5b5b5b;
  }
`;

import styled from '@emotion/styled';
import { DefaultDistrictRow, TopDistrictRow } from '../Row';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

// import Swiper core and required modules
import SwiperCore, { Scrollbar, Mousewheel } from 'swiper';
import FreeMode from 'swiper';
import { useUserData } from 'hooks';

// install Swiper modules
SwiperCore.use([FreeMode, Scrollbar, Mousewheel]);
type Props = {
  districtLeaderboardData: any[];
};
export const DistrictLeaderboard: React.FC<Props> = (props) => {
  const { townName2: myTown } = useUserData();
  return (
    <Swiper
      direction={'vertical'}
      slidesPerView={'auto'}
      freeMode={true}
      mousewheel={true}
      style={{
        height: '100%',
        padding: `0 18px`,
      }}
    >
      <SwiperSlide>
        {props.districtLeaderboardData.slice(0, 10).map((district) => {
          return myTown === district.name2 ? (
            <TopDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
              style={{
                border: `1px solid #4694FF`,
              }}
            />
          ) : (
            <TopDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
            />
          );
        })}
        {props.districtLeaderboardData.slice(10).map((district) => {
          return myTown === district.name2 ? (
            <DefaultDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
              style={{
                border: `1px solid #4694FF`,
              }}
            />
          ) : (
            <DefaultDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
            />
          );
        })}
      </SwiperSlide>
    </Swiper>
  );
};

const Container = styled.div`
  max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 60px;

  // Hide scrollbar but keep functionality
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

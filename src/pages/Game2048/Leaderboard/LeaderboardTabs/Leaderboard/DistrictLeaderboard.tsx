// import styled from '@emotion/styled';
import React from 'react';
import { DefaultDistrictRow, TopDistrictRow } from '../Row';
import { useUserData } from 'hooks';

import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';

type Props = {
  districtLeaderboardData: any[];
  isRanked: boolean;
};
const DistrictLeaderboard: React.FC<Props> = (props) => {
  const { townName2: myTown } = useUserData();
  return (
    <Swiper
      modules={[FreeMode, Scrollbar, Mousewheel]}
      // direction={'vertical'}
      // slidesPerView={'auto'}
      // mousewheel={true}
      style={{
        height: '100%',
        padding: `0 18px`,
        overflow: `auto`,
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
        <div style={{ padding: props.isRanked ? `75px` : `25px` }} />
      </SwiperSlide>
    </Swiper>
  );
};

export const MemoizedDistrictLeaderboard = React.memo(DistrictLeaderboard);

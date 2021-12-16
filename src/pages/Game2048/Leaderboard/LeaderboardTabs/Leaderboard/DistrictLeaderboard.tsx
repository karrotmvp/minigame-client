import React from 'react';
import { MemoizedTownRow as TownRow } from '../Row';
import { useUser } from 'hooks';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';
import type { TownLeaderboardType } from 'hooks';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import './leaderboard.scss';

type Props = {
  townLeaderboard: TownLeaderboardType[];
  isRanked: boolean;
};
const DistrictLeaderboard: React.FC<Props> = (props) => {
  const { town: userTown } = useUser();

  return (
    <Swiper
      modules={[FreeMode, Scrollbar, Mousewheel]}
      direction="vertical"
      mousewheel={true}
      freeMode={true}
      slidesPerView="auto"
      style={{
        height: '100%',
        padding: `0 16px`,
      }}
    >
      {props.townLeaderboard.map((town, i) => {
        return (
          <SwiperSlide key={i}>
            <TownRow
              key={town.townId}
              rank={town.rank}
              cityName={town.name1}
              districtName={town.name2}
              playerCount={town.playerCount as number}
              score={town.score}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const MemoizedDistrictLeaderboard = React.memo(DistrictLeaderboard);

// style={{
//   border: `${
//     userTown.id === town.townId ? `1px solid #4694FF` : `none`
//   }`,
// }}

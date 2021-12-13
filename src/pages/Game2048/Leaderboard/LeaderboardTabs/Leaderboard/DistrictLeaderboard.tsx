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

type Props = {
  townLeaderboard: TownLeaderboardType[];
  isRanked: boolean;
};
const DistrictLeaderboard: React.FC<Props> = (props) => {
  const { town: userTown } = useUser();

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
        {props.townLeaderboard.map((town) => {
          return userTown.id === town.townId ? (
            <TownRow
              key={town.townId}
              rank={town.rank}
              cityName={town.name1}
              districtName={town.name2}
              playerCount={town.playerCount as number}
              score={town.score}
              style={{
                border: `1px solid #4694FF`,
              }}
            />
          ) : (
            <TownRow
              key={town.townId}
              rank={town.rank}
              cityName={town.name1}
              districtName={town.name2}
              playerCount={town.playerCount as number}
              score={town.score}
            />
          );
        })}
        <div style={{ padding: props.isRanked ? `75px` : `25px` }} />
      </SwiperSlide>
    </Swiper>
  );
};

export const MemoizedDistrictLeaderboard = React.memo(DistrictLeaderboard);

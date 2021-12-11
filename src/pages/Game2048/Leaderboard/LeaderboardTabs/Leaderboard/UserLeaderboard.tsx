import React from 'react';
import { MemoizedUserRow as UserRow } from '../Row';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';

type Props = {
  userLeaderboardData: any[];
  isRanked: boolean;
};
const UserLeaderboard: React.FC<Props> = (props) => {
  return (
    <Swiper
      modules={[FreeMode, Scrollbar, Mousewheel]}
      style={{
        height: '100%',
        padding: `0 18px`,
        overflow: `auto`,
      }}
    >
      <SwiperSlide>
        {props.userLeaderboardData.map((user, i) => {
          return (
            <UserRow
              key={i}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          );
        })}
        <div style={{ padding: props.isRanked ? `75px` : `25px` }} />
      </SwiperSlide>
    </Swiper>
  );
};

export const MemoizedUserLeaderboard = React.memo(UserLeaderboard);

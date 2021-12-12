import React from 'react';
import { MemoizedUserRow as UserRow } from '../Row';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';
import { useUser } from 'hooks';
import type { UserLeaderboardType } from 'hooks';

type Props = {
  userLeaderboard: UserLeaderboardType[];
  isRanked: boolean;
};
const UserLeaderboard: React.FC<Props> = (props) => {
  const { user: myself } = useUser();
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
        {props.userLeaderboard.map((user) => {
          return user.userId === myself.userId ? (
            <UserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment as string}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
              style={{
                border: `1px solid #4694FF`,
              }}
            />
          ) : (
            <UserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment as string}
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

import { css } from '@emotion/css';
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
      direction="vertical"
      mousewheel={true}
      freeMode={true}
      slidesPerView="auto"
      className="userLeaderboardSwiper"
    >
      {props.userLeaderboard.map((user, i) => {
        return (
          <SwiperSlide
            key={i}
            className={css`
              ${user.userId === myself.userId
                ? `&::before {
                z-index: 1000;
                content: '';
                position: absolute;
                top: 0;
                left: -16px;
                width: calc(100% + 32px);
                height: 2px;
                background-color: #4694ff;
              }
              &::after {
                z-index: 1000;
                content: '';
                position: absolute;
                bottom: 0;
                left: -16px;
                width: calc(100% + 32px)
                height: 2px;
                background-color: #4694ff;
              }`
                : ``}
            `}
          >
            <UserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment as string}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const MemoizedUserLeaderboard = React.memo(UserLeaderboard);

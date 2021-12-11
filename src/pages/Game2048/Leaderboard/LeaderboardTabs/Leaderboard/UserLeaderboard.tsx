import React from 'react';
import { TopUserRow } from '../Row/TopRow';
import { DefaultUserRow } from '../Row/DefaultRow';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';
import { rem } from 'polished';

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
        {props.userLeaderboardData.slice(0, 10).map((user, i) => {
          return (
            <TopUserRow
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

        <p
          style={{
            margin: `17px 0 17px`,
            fontStyle: `normal`,
            fontWeight: `normal`,
            fontSize: `${rem(16)}`,
            lineHeight: `161.7%`,
            textAlign: `center`,
            color: `#7c7c7c`,
          }}
        >
          🎉 TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </p>

        {props.userLeaderboardData.slice(10).map((user, i) => {
          return (
            <DefaultUserRow
              key={i}
              rank={user.rank}
              nickname={user.nickname}
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

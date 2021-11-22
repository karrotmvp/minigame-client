import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { TopUserRow } from '../Row/TopRow';
import { DefaultUserRow } from '../Row/DefaultRow';

import { FreeMode, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/free-mode/free-mode.scss';
import 'swiper/modules/scrollbar/scrollbar.scss';
import 'swiper/modules/mousewheel/mousewheel.scss';

type Props = {
  userLeaderboardData: any[];
  shouldSticky?: boolean;
};
export const UserLeaderboard: React.FC<Props> = (props) => {
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
        {props.userLeaderboardData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          );
        })}

        <Text>
          🎉 TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </Text>

        {props.userLeaderboardData.slice(10).map((user) => {
          return (
            // <SwiperSlide>
            <DefaultUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              score={user.score}
              cityName={user.town.name1}
              districtName={user.town.name2}
            />
          );
        })}
      </SwiperSlide>
    </Swiper>
  );
};

// const Container = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   height: 100%;
//   // overflow: hidden;
// `;

// const LeaderboardWrapper = styled.div`
//   display: flex;
//   flex-flow: column;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//   overflow-y: auto;
//   padding-bottom: 60px;

//   // // Hide scrollbar but keep functionality
//   // &::-webkit-scrollbar {
//   //   display: none;
//   // }
//   // -ms-overflow-style: none; /* IE and Edge */
//   // scrollbar-width: none; /* Firefox */
// `;

const Text = styled.p`
  margin: 17px 0 17px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* or 26px */

  text-align: center;

  color: #7c7c7c;
`;

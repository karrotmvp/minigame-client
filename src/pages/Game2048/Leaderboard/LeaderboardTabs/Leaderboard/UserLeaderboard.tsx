import styled from '@emotion/styled';
import { TopUserRow } from '../Row/TopRow';
import { DefaultUserRow } from '../Row/DefaultRow';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

// import Swiper core and required modules
import SwiperCore, { Scrollbar, Mousewheel } from 'swiper';
import FreeMode from 'swiper';

// install Swiper modules
SwiperCore.use([FreeMode, Scrollbar, Mousewheel]);

type Props = {
  userLeaderboardData: any[];
};
export const UserLeaderboard: React.FC<Props> = (props) => {
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

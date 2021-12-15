import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { ReactComponent as IconArrowBackCircle } from 'assets/icon/svg/icon_arrow_back_circle.svg';
import { Nav } from 'components/Navigation';
import React, { useEffect } from 'react';
import { PageContainer } from 'styles';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
// import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import { useAccessToken, useUser } from 'hooks';
// import nextMissionNotificationOff from 'assets/svg/mission/next_mission_notification_off.svg';
// import nextMissionNotificationOn from 'assets/svg/mission/next_mission_notification_on.svg';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { Button } from 'components/Button';
import { rem } from 'polished';
export const Mission: React.FC = () => {
  const { pop, push } = useNavigator();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  // const { handleThirdPartyAgreement } = useMini();
  const { setMission } = useUser();
  const {
    setGameTypeToGame2048,
    updateMyScore: updateMyGame2048Score,
    updateMyComment: updateMyGame2048Comment,
  } = useMyGame2048Data();
  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_mission_page');
    }
  }, [analytics, isTop]);

  useEffect(() => {
    if (isTop) {
      localStorage.setItem(
        'missionPreference',
        JSON.stringify({
          isMissionCheckedOut: true,
          hasSeenSecondMission: true,
        })
      );
      setMission({
        page: { isCheckedOut: true },
        popup: { hasSeenSecondMission: true },
      });
    }
  }, [setMission, isTop]);

  const goBackToPlatform = () => {
    pop();
  };

  // // Turn on mission notification
  // const onSuccessHandler = () => {
  //   analytics.logEvent('click_third_party_agreement_button', {
  //     location: 'platform_page',
  //     button_type: 'notification_button',
  //   });
  //   setMission({ notification: { isOn: true } });
  // };
  // const turnNextMissionNotificationOn = async () => {
  //   if (accessToken) {
  //     const { data } =
  //       await minigameApi.notificationApi.saveNotificationUsingPOST({
  //         type: 'NEXT_MISSION' as NotificationRequestDtoTypeEnum,
  //       });
  //     if (data.status === 200) {
  //       analytics.logEvent('click_notification_button', {
  //         notification_type: 'next_mission',
  //       });
  //       setMission({ notification: { isOn: true } });
  //     }
  //   } else {
  //     handleThirdPartyAgreement(onSuccessHandler);
  //   }
  // };

  const goToGame2048 = async () => {
    setGameTypeToGame2048();
    // bypass in web environment
    try {
      if (accessToken) {
        analytics.logEvent('click_game_enter_button', {
          game_type: '2048_puzzle',
          is_new_user: false,
          location: 'mission_page',
        });
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_2048');
        if (data) {
          if (data.score && data.rank) {
            updateMyGame2048Score({
              score: data.score,
              rank: data.rank,
            });
          }
          if (data.comment) {
            updateMyGame2048Comment(data.comment);
          }
        }
        push(`/game-2048`);
      } else {
        analytics.logEvent('click_game_enter_button', {
          game_type: '2048_puzzle',
          is_new_user: true,
          location: 'mission_page',
        });
        push(`/game-2048`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav
        appendLeft={<IconArrowBackCircle />}
        onClickLeft={goBackToPlatform}
        style={{ alignItems: 'center', height: '80px' }}
      />
      <PageContainer>
        <div
          style={{
            position: `relative`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
          }}
        >
          <img
            src="https://minigame-karrot-raise-client-production.s3.ap-northeast-2.amazonaws.com/assets/mission/mission_2.png"
            alt="second-mission-information"
            style={{ width: `100%`, maxWidth: `100vw`, marginTop: `-80px` }}
          />
        </div>

        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            padding: `15px 18px 32px`,
            background: '#82B6FF',
          }}
        >
          <Button
            onClick={goToGame2048}
            color="primary"
            style={{ width: `100%` }}
          >
            <p
              style={{
                fontWeight: `bold`,
                fontSize: `${rem(20)}`,
                lineHeight: `161.7%`,
              }}
            >
              2048 게임 하기
            </p>
          </Button>
        </div>

        {/* <div
          style={{
            position: `relative`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
          }}
        >
          <img
            src="https://minigame-karrot-raise-client-production.s3.ap-northeast-2.amazonaws.com/assets/mission/mission_list.png"
            alt="upcoming-mission-list"
            style={{ width: `100%`, maxWidth: `100vw`, maxHeight: `100%` }}
          />

          {mission.notification?.isOn ? (
            <button
              style={{
                position: `absolute`,
                bottom: `8%`,
                zIndex: 2,
                width: `30%`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
              }}
              disabled
            >
              <img
                src={nextMissionNotificationOn}
                alt="next-mission-notificaion-is-on"
                style={{ boxSizing: `border-box`, width: `100%` }}
              />
            </button>
          ) : (
            <button
              style={{
                position: `absolute`,
                bottom: `8%`,
                zIndex: 2,
                width: `30%`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
              }}
              onClick={turnNextMissionNotificationOn}
            >
              <img
                src={nextMissionNotificationOff}
                alt="turn-next-mission-notification-on-button"
                style={{ boxSizing: `border-box`, width: `100%` }}
              />
            </button>
          )}
        </div> */}
      </PageContainer>
    </>
  );
};

import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { ReactComponent as IconArrowBackCircle } from 'assets/icon/svg/icon_arrow_back_circle.svg';
import { Nav } from 'components/Navigation';
import React, { useEffect } from 'react';
import { PageContainer } from 'styles';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import { useAccessToken, useMini, useUser } from 'hooks';
import nextMissionNotificationOff from 'assets/svg/mission/next_mission_notification_off.svg';
import nextMissionNotificationOn from 'assets/svg/mission/next_mission_notification_on.svg';
export const Mission: React.FC = () => {
  const { pop } = useNavigator();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  const { handleThirdPartyAgreement } = useMini();
  const { mission, setMission } = useUser();

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
          hasMissionPopupSeen: true,
        })
      );
      setMission({
        page: { isCheckedOut: true },
        popup: { hasSeen: true },
      });
    }
  }, [setMission, isTop]);

  const goBackToPlatform = () => {
    pop();
  };

  // Turn on mission notification
  const onSuccessHandler = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      location: 'platform_page',
      button_type: 'notification_button',
    });
    setMission({ notification: { isOn: true } });
  };
  const turnNextMissionNotificationOn = async () => {
    if (accessToken) {
      const { data } =
        await minigameApi.notificationApi.saveNotificationUsingPOST({
          type: 'NEXT_MISSION' as NotificationRequestDtoTypeEnum,
        });
      if (data.status === 200) {
        analytics.logEvent('click_notification_button', {
          notification_type: 'next_mission',
        });
        setMission({ notification: { isOn: true } });
      }
    } else {
      handleThirdPartyAgreement(onSuccessHandler);
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
            src="https://minigame-karrot-raise-client-production.s3.ap-northeast-2.amazonaws.com/assets/mission/mission_1.png"
            alt="first-mission-information"
            style={{ width: `100%`, maxWidth: `100vw`, marginTop: `-80px` }}
          />
        </div>

        <div
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
        </div>
      </PageContainer>
    </>
  );
};

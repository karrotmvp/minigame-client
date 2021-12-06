import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useAnalytics } from 'services/analytics';
import { rem } from 'polished';
import missionEnvelopeOpened from 'assets/svg/mission/mission_envelope_opened.svg';
import missionEnvelopeClosed1 from 'assets/svg/mission/mission_envelope_closed_1_outline.svg';
import xCircle from 'assets/svg/x_circle.svg';
import effect1 from 'assets/svg/effect1.svg';
import { setMissionPreference } from 'redux/user';

type Props = {
  setShouldMissionPopupShown: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Popup: React.FC<Props> = (props) => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const { push } = useNavigator();

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_mission_popup');
    }
  }, [analytics, isTop]);

  const closeMissionPopup = () => {
    localStorage.setItem(
      'missionPreference',
      JSON.stringify({
        isMissionCheckedOut: false,
        hasMissionPopupSeen: true,
      })
    );
    setMissionPreference({
      isMissionCheckedOut: false,
      hasMissionPopupSeen: true,
    });
    props.setShouldMissionPopupShown(false);
  };
  const goToMissionPage = () => {
    analytics.logEvent('click_mission_button', {
      location: 'mission_popup',
    });
    localStorage.setItem(
      'missionPreference',
      JSON.stringify({
        isMissionCheckedOut: true,
        hasMissionPopupSeen: true,
      })
    );
    setMissionPreference({
      isMissionChekcedOut: true,
      hasMissionPopupSeen: true,
    });
    props.setShouldMissionPopupShown(false);
    push(`/mission`);
  };

  return (
    <>
      <img
        src={effect1}
        alt=""
        style={{
          zIndex: 1,
          marginBottom: `-60px`,
        }}
      />
      <img src={missionEnvelopeOpened} alt="" style={{ zIndex: 2 }} />
      <h3
        style={{
          fontFamily: `Cafe24Ssurround`,
          fontStyle: `normal`,
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160%`,
          textAlign: `center`,
          color: `#FFFFFF`,
          margin: `32px 0 32px`,
        }}
      >
        <span
          style={{
            fontFamily: `Cafe24Ssurround`,
            fontStyle: `normal`,
            fontWeight: `bold`,
            fontSize: `${rem(22)}`,

            color: `#FFFFFF`,
            textDecoration: `underline #0E74FF 6px`,
            textUnderlineOffset: `-1px`,
          }}
        >
          첫 번째 동네대회 미션
        </span>
        이
        <br />
        도착했어요!
      </h3>
      <button
        onClick={closeMissionPopup}
        style={{ position: `absolute`, right: 28, top: 40, zIndex: 1000 }}
      >
        <img src={xCircle} alt="close-mission-popup-button" />
      </button>
      <button
        onClick={goToMissionPage}
        style={{ position: `absolute`, right: 0, bottom: 0, zIndex: 1000 }}
      >
        <Tooltip>Click!</Tooltip>
        <img
          src={missionEnvelopeClosed1}
          alt="mission-button-one-notification"
        />
      </button>
    </>
  );
};

const Tooltip = styled.div`
  position: relative;
  margin: auto;
  background: #e3efff;
  border-radius: 5px;

  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(12)};
  text-align: center;
  color: #0e74ff;

  width: fit-content;
  padding: 4px 10px;

  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 8px 6px;
    border-radius: 10px;
    border-top-color: #e3efff;
    border-bottom: 0;

    margin-left: -6px;
    margin-bottom: -6px;
  }
`;

import { createSlice } from '@reduxjs/toolkit';

export interface Subscription {
  isSubscribed?: boolean;
}

export interface Mission {
  notification?: {
    isOn: boolean;
  };
  page?: {
    isCheckedOut: boolean;
  };
  popup?: {
    hasSeen: boolean;
  };
}
interface UserState {
  uuid: string;
  regionId: string;
  referer:
    | 'FEED'
    | 'SUBSCRIBE_FEED_1'
    | 'SUBSCRIBE_FEED_2'
    | 'SUBSCRIBE_FEED_3'
    | 'NEAR_BY'
    | 'SHARE_GAME_2048'
    | 'SHARE_GAME_KARROT'
    | 'SHARE_PLATFORM'
    | 'SHARE_COMMUNITY'
    | 'LOGIN'
    | 'UNKNOWN';
  subscription: Subscription;
  mission: Mission;
  notification: {
    nextMission: {
      isNotificationOn: boolean;
    };
    newGame: {
      isNotificationOn: boolean;
    };
  };
}

const initialState: UserState = {
  uuid: '',
  regionId: '',

  referer: 'UNKNOWN',
  subscription: {
    isSubscribed: false,
  },
  mission: {
    notification: {
      isOn: false,
    },
    page: {
      isCheckedOut: false,
    },
    popup: {
      hasSeen: false,
    },
  },
  notification: {
    nextMission: {
      isNotificationOn: false,
    },
    newGame: {
      isNotificationOn: false,
    },
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveQueryString(state, action) {
      state.uuid = action.payload.uuid;
      state.regionId = action.payload.regionId;
      state.subscription.isSubscribed = action.payload.isSubscribed;
      state.referer = action.payload.referer;
    },
    setMission(state, action) {
      state.mission.notification = action.payload.notification;
      state.mission.page = action.payload.page;
      state.mission.popup = action.payload.popup;
    },
    setSubscription(state, action) {
      state.subscription.isSubscribed = action.payload.isSubscribed;
    },
    setNotification(state, action) {
      state.notification.newGame.isNotificationOn =
        action.payload.isNewGameNotificationOn;
      state.notification.nextMission.isNotificationOn =
        action.payload.isNextMissionNotificationOn;
    },
  },
});

export const { saveQueryString, setMission, setSubscription, setNotification } =
  userSlice.actions;

export default userSlice.reducer;

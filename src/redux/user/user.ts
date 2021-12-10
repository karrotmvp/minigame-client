import { createSlice } from '@reduxjs/toolkit';

export type RefererEnum =
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

export interface User {
  uuid?: string;
  userId?: string;
  regionId?: string;
  referer?: RefererEnum;
  nickname?: string;
  referralCode?: string;
}

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

export interface NewGame {
  notification?: {
    isOn: boolean;
  };
}

interface UserState {
  user: User;
  subscription: Subscription;
  mission: Mission;
  newGame: NewGame;
}

const initialState: UserState = {
  user: {
    uuid: '',
    userId: '',
    regionId: '',
    nickname: '',
    referer: 'UNKNOWN',
    referralCode: '',
  },
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
  newGame: {
    notification: {
      isOn: false,
    },
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.user = {
        uuid: payload.uuid ? payload.uuid : state.user.uuid,
        userId: payload.userId ? payload.userId : state.user.userId,
        regionId: payload.regionId ? payload.regionId : state.user.regionId,
        referer: payload.referer ? payload.referer : state.user.referer,
        nickname: payload.nickname ? payload.nickname : state.user.nickname,
        referralCode: payload.referralCode
          ? payload.referralCode
          : state.user.referralCode,
      };
    },
    setMission(state, action) {
      state.mission.notification = action.payload.notification;
      state.mission.page = action.payload.page;
      state.mission.popup = action.payload.popup;
    },
    setSubscription(state, action) {
      state.subscription.isSubscribed = action.payload.isSubscribed;
    },
    setNewGame(state, action) {
      state.newGame.notification = action.payload.notification;
    },
  },
});

export const {
  // saveQueryString,
  setUser,
  setMission,
  setSubscription,
  setNewGame,
} = userSlice.actions;

export default userSlice.reducer;

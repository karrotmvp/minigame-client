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

export interface Town {
  id?: string;
  name1?: string;
  name2?: string;
  name3?: string;
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
    hasSeenSecondMission: boolean;
  };
}

export interface NewGame {
  notification?: {
    isOn: boolean;
  };
}

interface UserState {
  user: User;
  town: Town;
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
  town: {
    id: '',
    name1: '',
    name2: '',
    name3: '',
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
      hasSeenSecondMission: false,
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
    setTown(state, { payload }) {
      state.town = {
        id: payload.id ? payload.id : state.town.id,
        name1: payload.name1 ? payload.name1 : state.town.name1,
        name2: payload.name2 ? payload.name2 : state.town.name2,
        name3: payload.name3 ? payload.name3 : state.town.name3,
      };
    },
    setMission(state, { payload }) {
      state.mission = {
        notification: payload.notification
          ? payload.notification
          : state.mission.notification,
        page: payload.page ? payload.page : state.mission.page,
        popup: payload.popup ? payload.popup : state.mission.popup,
      };
    },
    setSubscription(state, { payload }) {
      state.subscription = {
        isSubscribed: payload.isSubscribed
          ? payload.isSubscribed
          : state.subscription.isSubscribed,
      };
    },
    setNewGame(state, { payload }) {
      state.newGame = {
        notification: payload.notification
          ? payload.notification
          : state.newGame.notification,
      };
    },
  },
});

export const { setUser, setTown, setMission, setSubscription, setNewGame } =
  userSlice.actions;

export default userSlice.reducer;

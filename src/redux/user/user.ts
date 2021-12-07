import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useMinigameApi } from 'services/api/minigameApi';

const MinigameApi = () => {
  const minigameApi = useMinigameApi();
  return {
    minigameApi,
  };
};

export const trackVisitor = createAsyncThunk(
  'user/trackVisitor',
  async (_args, { getState }) => {
    const { uuid, regionId, referer } = getState() as {
      uuid: string;
      regionId: string;
      referer:
        | 'FEED'
        | 'NEAR_BY'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM'
        | 'SHARE_COMMUNITY'
        | 'LOGIN'
        | 'UNKNOWN';
    };

    console.log(uuid, regionId, referer);
    const data = await MinigameApi().minigameApi.visitorApi.visitUsingPOST(
      uuid,
      regionId,
      referer
    );
    // .visitUsingPOST(uuid, regionId, referer);
    return data;
  }
);

interface UserState {
  uuid: string;
  regionId: string;
  isSubscribed: boolean;
  referer:
    | 'FEED'
    | 'NEAR_BY'
    | 'SHARE_GAME_2048'
    | 'SHARE_GAME_KARROT'
    | 'SHARE_PLATFORM'
    | 'SHARE_COMMUNITY'
    | 'LOGIN'
    | 'UNKNOWN';
  isMissionCheckedOut: boolean;
  hasMissionPopupSeen: boolean;
  notification: {
    nextMission: {
      isNotificationOn: boolean;
    };
    newGame: {
      isNotificationOn: boolean;
    };
  };
  status: string;
  // payload: {};
}

const initialState: UserState = {
  uuid: '',
  regionId: '',
  isSubscribed: false,
  referer: 'UNKNOWN',
  isMissionCheckedOut: false,
  hasMissionPopupSeen: false,
  notification: {
    nextMission: {
      isNotificationOn: false,
    },
    newGame: {
      isNotificationOn: false,
    },
  },

  status: '',
  // payload: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUserInfo(state, action) {
      state.uuid = action.payload.uuid;
      state.regionId = action.payload.regionId;
      state.isSubscribed = action.payload.isSubscribed;
      state.referer = action.payload.referer;
    },
    setMissionPreference(state, action) {
      state.isMissionCheckedOut = action.payload.isMissionCheckedOut;
      state.hasMissionPopupSeen = action.payload.hasMissionPopupSeen;
    },
    setNotificationPreference(state, action) {
      state.notification.newGame.isNotificationOn =
        action.payload.isNewGameNotificationOn;
      state.notification.nextMission.isNotificationOn =
        action.payload.isNextMissionNotificationOn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(trackVisitor.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(trackVisitor.fulfilled, (state, { payload }) => {
      state.status = 'success';
      // state.payload = payload;
    });

    builder.addCase(trackVisitor.rejected, (state, { payload }) => {
      state.status = 'failed';
    });
  },
});

export const { saveUserInfo, setMissionPreference, setNotificationPreference } =
  userSlice.actions;
export default userSlice.reducer;

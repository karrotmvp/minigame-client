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
        | 'UNKNOWN'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM';
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
    | 'UNKNOWN'
    | 'SHARE_GAME_2048'
    | 'SHARE_GAME_KARROT'
    | 'SHARE_PLATFORM';
  status: string;
  // payload: {};
}

const initialState: UserState = {
  uuid: '',
  regionId: '',
  isSubscribed: false,
  referer: 'UNKNOWN',
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

export const { saveUserInfo } = userSlice.actions;
export default userSlice.reducer;

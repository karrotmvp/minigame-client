import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useMinigameApi } from 'services/api/minigameApi';

export const trackVisitor: any = createAsyncThunk(
  'user/trackVisitor',
  async (_args, { getState }) => {
    const { uuid, regionId, referer } = getState() as {
      uuid: string;
      regionId: string;
      referer: 'FEED' | 'NEAR_BY' | 'SHARE' | 'UNKNOWN';
    };
    const minigameApi = useMinigameApi();
    const data = await minigameApi.visitorApi.visitUsingPOST(
      uuid,
      regionId,
      referer
    );
    return data;
  }
);

interface UserState {
  uuid: string;
  regionId: string;
  installed: string;
  referer: 'FEED' | 'NEAR_BY' | 'SHARE' | 'UNKNOWN';
  status: string;
  payload: any[];
}

const initialState: UserState = {
  uuid: '',
  regionId: '',
  installed: '',
  referer: 'UNKNOWN',
  status: '',
  payload: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUserInfo(state, action) {
      state.uuid = action.payload.uuid;
      state.regionId = action.payload.regionId;
      state.installed = action.payload.installed;
      state.referer = action.payload.referer;
    },
  },
  extraReducers: {
    [trackVisitor.pending]: (state, action) => {
      state.status = 'loading';
    },
    [trackVisitor.fulfilled]: (state, { payload }) => {
      state.payload = payload;
      state.status = 'success';
    },
    [trackVisitor.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export const { saveUserInfo } = userSlice.actions;
export default userSlice.reducer;

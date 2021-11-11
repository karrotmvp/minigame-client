import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  setUserInfoAction,
  setRegionInfoAction,
  setDistrictInfoAction,
} from 'reducers/userDataReducer';

export const useUserData = () => {
  const { userId, nickname, regionId, districtId, districtName } = useSelector(
    (state: RootState) => ({
      userId: state.userDataReducer.userId,
      nickname: state.userDataReducer.nickname,
      regionId: state.userDataReducer.regionId,
      districtId: state.userDataReducer.districtId,
      cityName: state.userDataReducer.cityName,
      districtName: state.userDataReducer.districtName,
    })
  );
  const dispatch = useDispatch();

  const setRegionInfo = (regionId: string) => {
    dispatch(setRegionInfoAction(regionId));
  };

  const setDistrictInfo = (
    districtId: string,
    cityName: string,
    districtName: string
  ) => {
    dispatch(setDistrictInfoAction(districtId, cityName, districtName));
  };

  const setUserInfo = (userId: string, nickname: string) => {
    dispatch(setUserInfoAction(userId, nickname));
  };

  return {
    userId,
    nickname,
    regionId,
    districtId,
    districtName,
    setRegionInfo,
    setDistrictInfo,
    setUserInfo,
  };
};

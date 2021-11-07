import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  setUserInfoAction,
  setRegionInfoAction,
  setDistrictInfoAction,
} from 'reducers/userDataReducer';

export const useUserData = () => {
  const { userId, userName, regionId, districtId, districtName } = useSelector(
    (state: RootState) => ({
      userId: state.userDataReducer.userId,
      userName: state.userDataReducer.userName,
      regionId: state.userDataReducer.regionId,
      districtId: state.userDataReducer.districtId,
      districtName: state.userDataReducer.districtName,
    })
  );
  const dispatch = useDispatch();

  const setRegionInfo = (regionId: string) => {
    dispatch(setRegionInfoAction(regionId));
  };

  const setDistrictInfo = (districtId: string, districtName: string) => {
    dispatch(setDistrictInfoAction(districtId, districtName));
  };

  const setUserInfo = (userId: string, userName: string) => {
    dispatch(setUserInfoAction(userId, userName));
  };

  return {
    userId,
    userName,
    regionId,
    districtId,
    districtName,
    setRegionInfo,
    setDistrictInfo,
    setUserInfo,
  };
};

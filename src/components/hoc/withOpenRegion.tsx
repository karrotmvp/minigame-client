import { useNavigator } from '@karrotframe/navigator';
import { useUserData } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';

export const withOpenRegion = (WrappedComponent: any) => {
  const OpenRegionCheck = (props: any) => {
    const minigameApi = useMinigameApi();
    const { regionId, setDistrictInfo } = useUserData();
    const { push } = useNavigator();
    const [isOpenRegion, setIsOpenRegion] = useState(true);

    const checkOpenRegion = useCallback(async function (
      regionId: string | null
    ) {
      try {
        if (regionId === null) {
          throw new Error('regionId is null. Are you on Web environment?');
        }
        const {
          data: { data },
        } = await minigameApi.townApi().getTownInfoUsingGET(regionId);

        // example -> city=서울특별시(name1) district=서초구(name2)
        if (data) {
          setDistrictInfo(data.id, data.name1, data.name2);
          // Filter out if user is not in our service area
          // 서초, 송파, 광진, 강남, 강동 in order
          const openedDistricts = [
            'df5370052b3c',
            'edc00a5031fe',
            '264e8b88eaa1',
            '9bdfe83b68f3',
            '072985998dd4',
          ];
          const isMyDistrictOpen = openedDistricts.indexOf(data.id);
          if (isMyDistrictOpen === -1) {
            setIsOpenRegion(false);
            push(`/non-service-area`);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    []);

    useEffect(() => {
      // checkOpenRegion(karrotRaiseApi, regionId);
      if (isOpenRegion === false) {
        push(`/non-service-area`);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
  return OpenRegionCheck;
};

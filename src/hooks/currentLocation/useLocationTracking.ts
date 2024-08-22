import useCurrentLocation from 'hooks/currentLocation/useCurrentLocation';
import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useRecoilState} from 'recoil';
import {locationState} from 'state/locationState';

// 특정 위치에서 지속적으로 위치를 트래킹하고 싶을때 사용
export const useLocationTracking = (interval: number = 3000) => {
  const [currentLocation, setCurrentLocation] = useRecoilState(locationState);

  // FIXME: 최적화 가능, 권한 문제때문에 가져옴, 개발 시 간헐적으로 리로드 후 권한을 가져오지 못하는 문제 존재, 실제 배포환경에서도 그럴지는 확인되지 않음
  useCurrentLocation();

  useEffect(() => {
    const locationWatchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: interval,
        fastestInterval: interval,
      },
    );

    return () => {
      Geolocation.clearWatch(locationWatchId);
    };
  }, [interval]);

  return currentLocation;
};

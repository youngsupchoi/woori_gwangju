import {useState, useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';

// 특정 위치에서 지속적으로 위치를 트래킹하고 싶을때 사용
export const useLocationTracking = (interval: number = 3000) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const locationWatchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('hihi');
        setLocation({latitude, longitude});
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

  return location;
};

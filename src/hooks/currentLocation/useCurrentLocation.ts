import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useRecoilState} from 'recoil';
import {locationState} from 'state/locationState';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const useCurrentLocation = () => {
  const [location, setLocation] = useRecoilState(locationState);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let permissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permissionStatus = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
      }

      if (permissionStatus === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({latitude, longitude});
          },
          error => {
            console.log('Error getting location: ', error);
          },
          {enableHighAccuracy: true, timeout: 3000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
      }
    };

    requestLocationPermission();
  }, [setLocation]);

  return location;
};

export default useCurrentLocation;

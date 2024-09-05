import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useRecoilState} from 'recoil';
import {locationState} from 'state/locationState';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {Platform, Alert} from 'react-native';

const useInitCurrentLocation = async () => {
  const [location, setLocation] = useRecoilState(locationState);

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
          setLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          });
        },
        error => {
          console.log('Error getting location: ', error);
        },
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 10000},
      );
    } else if (permissionStatus === RESULTS.DENIED) {
      console.log('Location permission denied');
    } else if (permissionStatus === RESULTS.BLOCKED) {
      Alert.alert(
        '위치 권한이 거부되었습니다',
        '앱 설정에서 위치 권한을 허용해주세요.',
        [
          {text: '설정으로 이동', onPress: () => openSettings()},
          {text: '취소', style: 'cancel'},
        ],
      );
    }
  };

  await requestLocationPermission();

  return location;
};

export default useInitCurrentLocation;

import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import currentLocatinoPin from '../../../assets/images/currentLocationPin.png';
import {useLocationTracking} from 'hooks/currentLocation/useLocationTracking';
import useCurrentLocation from 'hooks/currentLocation/useCurrentLocation';
import {useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';

const CurrentLocationMarker: React.FC = () => {
  useCurrentLocation();
  useLocationTracking(3000); // 3초마다 위치를 트래킹합니다.

  const currentLocation = useRecoilValue(locationState);
  console.log('hihi');
  console.log('🚀 ~ longitude:', currentLocation.longitude);
  console.log('🚀 ~ latitude:', currentLocation.latitude);

  return (
    <View>
      <Marker
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
        title="현재 위치"
        image={currentLocatinoPin}
        zIndex={3}
      />
    </View>
  );
};

export default CurrentLocationMarker;

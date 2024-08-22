import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import currentLocatinoPin from '../../../assets/images/currentLocationPin.png';
import {useLocationTracking} from 'hooks/currentLocation/useLocationTracking';

const CurrentLocationMarker: React.FC = () => {
  const {latitude, longitude} = useLocationTracking(3000); // 3초마다 위치를 트래킹합니다.

  return (
    <View>
      <Marker
        coordinate={{latitude, longitude}}
        title="현재 위치"
        image={currentLocatinoPin}
        zIndex={3}
      />
    </View>
  );
};

export default CurrentLocationMarker;

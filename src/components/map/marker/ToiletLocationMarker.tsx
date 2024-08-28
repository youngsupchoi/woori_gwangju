import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import currentLocatinoPin from '../../../assets/images/currentLocationPin.png';
import {useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';

const ToiletLocationMarker: React.FC = () => {
  const currentLocation = useRecoilValue(locationState);
  return (
    <View>
      <Marker
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
        title="현재 위치"
        image={currentLocatinoPin}
        zIndex={7}
      />
    </View>
  );
};

export default ToiletLocationMarker;

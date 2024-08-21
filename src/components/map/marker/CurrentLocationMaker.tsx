import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import {useRecoilValue} from 'recoil';

import currentLocatinoPin from '../../../assets/images/currentLocationPin.png';
import {locationState} from 'state/locationState';

export const rederCurrentLocationMarker = () => {
  const currentLocation = useRecoilValue(locationState);
  return (
    <View>
      <Marker
        coordinate={currentLocation}
        title="현재 위치"
        image={currentLocatinoPin}
        zIndex={3}
      />
    </View>
  );
};

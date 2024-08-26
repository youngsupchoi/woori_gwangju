import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import defaultPlaceMarker from '../../../assets/images/defaultPlaceMarker.png';
import {useRecoilState, useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';
import {SelectedLocationState} from 'state/HomeMapAtoms';

const TouchedLocationMarker: React.FC = () => {
  const currentLocation = useRecoilValue(locationState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(
    SelectedLocationState,
  );
  return (
    <View>
      <Marker
        coordinate={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }}
        title="선택한 위치"
        image={defaultPlaceMarker}
        zIndex={7}
      />
    </View>
  );
};

export default TouchedLocationMarker;

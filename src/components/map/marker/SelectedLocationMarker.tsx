import React from 'react';
import {View} from 'react-native';
import {Marker} from 'react-native-maps';
import defaultPlaceMarker from '../../../assets/images/defaultPlaceMarker.png';
import BusStationPlaceMarker from '../../../assets/images/busStationMarker.png';
import MetroStationPlaceMarker from '../../../assets/images/metroStationMarker.png';

const SelectedLocationMarker: React.FC<{
  name: string;
  latitude: number;
  longitude: number;
}> = ({name, latitude, longitude}) => {
  let markerImage = defaultPlaceMarker;

  // name에 "[버스정류장]"이 포함되어 있는지 확인하고, 포함되어 있다면 BusStationPlaceMarker를 렌더링합니다.
  if (name.includes('[버스정류장]')) {
    markerImage = BusStationPlaceMarker;
  }
  // name에 "호선]" 혹은 "번출구"가 포함되어 있다면 MetroStationPlaceMarker를 렌더링합니다.
  else if (name.includes('호선]') || name.includes('번출구')) {
    markerImage = MetroStationPlaceMarker;
  }

  return (
    <View>
      <Marker
        coordinate={{latitude, longitude}}
        image={markerImage}
        zIndex={3}
      />
    </View>
  );
};

export default SelectedLocationMarker;

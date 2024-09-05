import React, {useEffect, useState} from 'react';
import MapView, {Region} from 'react-native-maps';
import {View} from 'native-base';
import {useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';
import SelectedLocationMarker from 'components/map/marker/SelectedLocationMarker';

const SearchResultMapComponent: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
  destination: {
    name: string;
    latitude: number | string; // string일 가능성도 체크
    longitude: number | string; // string일 가능성도 체크
  };
}> = ({mapRef, onRegionChangeComplete, destination}) => {
  // 현재 위치를 가져옵니다.  locationState는 recoil을 사용하여 전역 상태로 관리합니다.
  const currentLocation: {
    latitude: number | string; // string일 가능성도 체크
    longitude: number | string; // string일 가능성도 체크
  } = useRecoilValue(locationState);

  const [region, setRegion] = useState<Region>({
    latitude: parseFloat(destination.latitude as string),
    longitude: parseFloat(destination.longitude as string),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  // currentLocation이 변경될 때마다 region 상태를 업데이트
  useEffect(() => {
    setRegion({
      latitude: parseFloat(currentLocation.latitude as string),
      longitude: parseFloat(currentLocation.longitude as string),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [currentLocation]);

  return (
    <View
      style={{flex: 1}}
      position={'absolute'}
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={-1}>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={{
          latitude: parseFloat(destination.latitude as string),
          longitude: parseFloat(destination.longitude as string),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        <SelectedLocationMarker
          name={destination.name}
          latitude={parseFloat(destination.latitude as string)}
          longitude={parseFloat(destination.longitude as string)}
        />
        <CurrentLocationMarker />
      </MapView>
    </View>
  );
};

export default SearchResultMapComponent;

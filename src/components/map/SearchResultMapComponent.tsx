import React, {useEffect, useState} from 'react';
import MapView, {Region} from 'react-native-maps';
// import {renderPolylines} from 'components/map/marker/WalkPoliLine';
// import {renderMarkers} from 'components/map/marker/StartMidEndMarker';
import {View} from 'native-base';
import {useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';

const SearchResultMapComponent: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
}> = ({mapRef, onRegionChangeComplete}) => {
  // 현재 위치를 가져옵니다.  locationState는 recoil을 사용하여 전역 상태로 관리합니다.
  const currentLocation: {
    latitude: number;
    longitude: number;
  } = useRecoilValue(locationState);

  const [region, setRegion] = useState<Region>({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  // currentLocation이 변경될 때마다 region 상태를 업데이트
  useEffect(() => {
    setRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
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
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {/* {renderPolylines()} */}
        {/* {renderMarkers()} */}
        {/* {rederCurrentLocationMarker(region.latitude, region.longitude)} */}
        <CurrentLocationMarker />
      </MapView>
    </View>
  );
};

export default SearchResultMapComponent;

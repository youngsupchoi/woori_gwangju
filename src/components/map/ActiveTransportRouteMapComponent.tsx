import React from 'react';
import {Text, View} from 'native-base';
import MapView, {Circle, Marker, Polyline, Region} from 'react-native-maps';
// import {rederCurrentLocationMarker} from 'components/map/marker/CurrentLocationMaker';
import {ActiveWalkRouteMarker} from 'components/map/marker/ActiveWalkRouteMarker';
import {locationState} from 'state/locationState';
import {useRecoilValue} from 'recoil';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';
import TransportRoutePolyline from 'components/map/marker/TransportRoutePolyLine';
import TransportRouteMarker from 'components/map/marker/TransportRouteMarker';

const ActiveTransportRouteMapComponent: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
  route: any;
}> = ({mapRef, onRegionChangeComplete, route}) => {
  const currentLocationState = useRecoilValue(locationState);

  if (!route || !route.legs || route.legs.length === 0) {
    return (
      <View>
        <Text>경로 데이터가 없습니다.</Text>
      </View>
    ); // route가 없을 경우 처리
  }

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={{
          latitude: parseFloat(route.legs[0].start.lat), // 경로의 첫 시작점을 지도의 초기 위치로 설정
          longitude: parseFloat(route.legs[0].start.lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {TransportRoutePolyline(route)}
        {TransportRouteMarker(route)}
        {/* {rederCurrentLocationMarker(
          currentLocationState.latitude,
          currentLocationState.longitude,
        )} */}
        <CurrentLocationMarker />
      </MapView>
    </View>
  );
};

export default ActiveTransportRouteMapComponent;

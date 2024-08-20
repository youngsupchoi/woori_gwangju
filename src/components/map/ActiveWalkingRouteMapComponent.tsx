import React from 'react';
import {View} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';

const ActiveWalkingRouteMapComponente: React.FC = () => {
  const walkingRoute = useRecoilValue(walkingRouteAtom);

  const initialRegion = {
    latitude: 37.556774278906374,
    longitude: 126.92364851900282,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const renderPolylines = () => {
    return walkingRoute.features
      .filter(feature => feature.geometry.type === 'LineString')
      .map((feature, index) => {
        const coordinates = feature.geometry.coordinates as [number, number][];

        const polylineCoordinates = coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        return (
          <Polyline
            key={`polyline-${index}`}
            coordinates={polylineCoordinates}
            strokeColor="#0000FF" // 파란색 선
            strokeWidth={6} // 선 두께
          />
        );
      });
  };

  const renderMarkers = () => {
    return walkingRoute.features
      .filter(feature => feature.geometry.type === 'Point')
      .map((feature, index) => {
        const coordinates = feature.geometry.coordinates as [number, number];
        const {pointType, description} = feature.properties;

        return (
          <Marker
            key={`marker-${index}`}
            coordinate={{
              latitude: coordinates[1],
              longitude: coordinates[0],
            }}
            title={description}
            pinColor={
              pointType === 'SP'
                ? 'green' // 시작 지점
                : pointType === 'EP'
                ? 'red' // 도착 지점
                : 'blue' // 중간 지점
            }
          />
        );
      });
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        initialRegion={initialRegion}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {renderPolylines()}
        {renderMarkers()}
      </MapView>
    </View>
  );
};

export default ActiveWalkingRouteMapComponente;

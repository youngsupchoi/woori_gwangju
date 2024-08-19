import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Box} from 'native-base';

export default function ActiveWalkingRouteMapComponente() {
  return (
    <Box flex={1}>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: 37.5665, // 초기 맵 중심 위치 (예시: 서울의 위도/경도)
          longitude: 126.978,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={{latitude: 37.5665, longitude: 126.978}} // 예시 마커
          title="출발"
          description="여기서 시작합니다."
        />
      </MapView>
    </Box>
  );
}

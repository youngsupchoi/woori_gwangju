import React from 'react';
import {View} from 'react-native';
import {Polyline} from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';

export const renderPolylines = () => {
  const walkingRoute = useRecoilValue(walkingRouteAtom);
  console.log('🚀 ~ renderPolylines ~ walkingRoute:', walkingRoute);
  return walkingRoute.features
    .filter(feature => feature.geometry.type === 'LineString')
    .map((feature, index) => {
      const coordinates = feature.geometry.coordinates as [number, number][];

      const polylineCoordinates = coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      return (
        <View key={`polyline-group-${index}`}>
          {/* 아래에 그려질 두꺼운 폴리라인 */}
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#007AFF"
            lineJoin="round"
            strokeWidth={8}
            lineCap="round"
            zIndex={1} // 아래쪽에 그려지도록 설정
          />
          {/* 위에 얇게 그려질 폴리라인 */}
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#FFFFFF"
            lineJoin="round"
            lineDashPattern={[1, 12]} // 점선 패턴
            strokeWidth={3}
            lineCap="round"
            zIndex={2} // 위쪽에 그려지도록 설정
            geodesic={true}
          />
        </View>
      );
    });
};

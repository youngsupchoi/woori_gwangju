import React from 'react';
import {View} from 'native-base';
import {Polyline} from 'react-native-maps';

const TransportRoutePolyline = route => {
  return route.legs.map((leg, index) => {
    // 각 구간의 linestring 데이터를 Polyline으로 변환
    const coordinates = leg.passShape?.linestring.split(' ').map(coord => {
      const [lon, lat] = coord.split(',').map(parseFloat);
      return {latitude: lat, longitude: lon};
    });

    return (
      <View key={`polyline-group-${index}`}>
        {/* 아래에 그려질 두꺼운 폴리라인 */}
        <Polyline
          key={index}
          coordinates={coordinates}
          strokeColor={`#${leg.routeColor || '000'}`} // 경로 색상, 없으면 검정색
          strokeWidth={8}
          lineCap="round"
        />
        {/* 위에 얇게 그려질 폴리라인 */}
        <Polyline
          coordinates={coordinates}
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

export default TransportRoutePolyline;

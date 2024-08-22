import React from 'react';
import {View} from 'native-base';
import {Circle, Marker} from 'react-native-maps';
import endPin from '../../../assets/images/endPin.png';
import midPin from '../../../assets/images/midPin.png';
import startPin from '../../../assets/images/startPin.png';

const TransportRouteMarker = route => {
  const markers = [];

  // 출발지 Marker (이미지 사용)
  markers.push(
    <Marker
      key="end"
      coordinate={{
        latitude: route.legs[0].start.lat,
        longitude: route.legs[0].start.lon,
      }}
      title="도착지"
      image={endPin} // 시작점 이미지를 사용
      zIndex={3} // 시작점 zIndex를 높게 설정
    />,
  );

  // 도착지 Marker (이미지 사용)
  markers.push(
    <Marker
      key="start"
      coordinate={{
        latitude: route.legs[route.legs.length - 1].end.lat,
        longitude: route.legs[route.legs.length - 1].end.lon,
      }}
      title="출발지"
      image={startPin} // 도착점 이미지를 사용
      zIndex={3} // 도착점 zIndex를 높게 설정
    />,
  );

  // 중간 경유지 Marker (이미지 사용)
  route.legs.forEach((leg, legIndex) => {
    if (leg.passStopList) {
      leg.passStopList.stationList.forEach((station, stationIndex) => {
        markers.push(
          <Marker
            key={`station-${legIndex}-${stationIndex}`}
            coordinate={{
              latitude: parseFloat(station.lat),
              longitude: parseFloat(station.lon),
            }}
            title={station.stationName}
            image={midPin} // 중간 경유지 이미지를 사용
            zIndex={2} // 중간 경유지는 낮은 zIndex
          />,
        );
      });
    }
  });

  return markers;
};

export default TransportRouteMarker;

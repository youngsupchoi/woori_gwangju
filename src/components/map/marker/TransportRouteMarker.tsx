import React from 'react';
import {View} from 'native-base';
import {Circle, Marker} from 'react-native-maps';

const TransportRouteMarker = route => {
  const markers = [];

  // 출발지 Marker
  markers.push(
    <Marker
      key="start"
      coordinate={{
        latitude: route.legs[0].start.lat,
        longitude: route.legs[0].start.lon,
      }}
      title="출발지"
      pinColor="green">
      <View bg={'red.500'} h={'20'} />
    </Marker>,
  );

  // 도착지 Marker
  markers.push(
    <Marker
      key="end"
      coordinate={{
        latitude: route.legs[route.legs.length - 1].end.lat,
        longitude: route.legs[route.legs.length - 1].end.lon,
      }}
      title="도착지"
      pinColor="red"
    />,
  );

  // 중간 경유지 Marker (버스 정류장, 지하철 역 등)
  route.legs.forEach((leg, legIndex) => {
    if (leg.passStopList) {
      leg.passStopList.stationList.forEach((station, stationIndex) => {
        markers.push(
          <Circle
            key={`station-${legIndex}-${stationIndex}`}
            // coordinate={{
            //   latitude: parseFloat(station.lat),
            //   longitude: parseFloat(station.lon),
            // }}
            title={station.stationName}
          />,
        );
      });
    }
  });

  return markers;
};

export default TransportRouteMarker;

import React from 'react';
import {Marker} from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import endPin from '../../../assets/images/endPin.png';
import midPin from '../../../assets/images/midPin.png';
import startPin from '../../../assets/images/startPin.png';
import {View} from 'native-base';

export const ActiveWalkRouteMarker = () => {
  const walkingRoute = useRecoilValue(walkingRouteAtom);
  return walkingRoute.features
    .filter(feature => feature.geometry.type === 'Point')
    .map((feature, index) => {
      const coordinates = feature.geometry.coordinates as [number, number];
      const {pointType, description} = feature.properties;

      // 각 핀 타입에 맞는 이미지 및 zIndex 할당
      let markerImage;
      let zIndex = 1; // 기본 zIndex는 낮게 설정

      if (pointType === 'SP') {
        markerImage = startPin;
        zIndex = 3; // 시작점 zIndex를 높게 설정
      } else if (pointType === 'EP') {
        markerImage = endPin;
        zIndex = 3; // 도착점 zIndex를 높게 설정
      } else {
        markerImage = midPin;
        zIndex = 2; // 중간점은 낮은 zIndex
      }

      return (
        <View key={index}>
          <Marker
            key={`marker-${index}`}
            coordinate={{
              latitude: coordinates[1],
              longitude: coordinates[0],
            }}
            title={description}
            image={markerImage} // 핀 이미지 설정
            zIndex={zIndex} // zIndex 설정
          />
        </View>
      );
    });
};

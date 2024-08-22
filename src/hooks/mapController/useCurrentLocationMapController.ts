import {useRef} from 'react';
import MapView, {Region} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useRecoilState} from 'recoil';
import {mapZoomLevelAtom} from 'state/activeWalkingRouteAtom';

export const useCurrentLocationMapController = () => {
  const mapRef = useRef<MapView | null>(null);
  const [zoomLevel, setZoomLevel] = useRecoilState(mapZoomLevelAtom);

  // 현재 위치를 가져와서 지도 중심과 줌 레벨을 설정하는 함수
  const setMapToCurrentLocation = (zoomLevel: number) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const zoomFactor = Math.pow(2, zoomLevel);
        const latitudeDelta = 1 / zoomFactor;
        const longitudeDelta = 1 / zoomFactor;

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta,
              longitudeDelta,
            },
            10, // 애니메이션 지속 시간 (밀리초)
          );
        }
      },
      error => {
        console.error('Error getting current location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // 지도 영역이 변경될 때 줌 레벨 업데이트
  const onRegionChangeComplete = (region: Region) => {
    const newZoomLevel = Math.log2(360 / region.longitudeDelta);
    setZoomLevel(newZoomLevel); // 줌 레벨 상태 업데이트
    console.log('🚀 ~ useCurrentLocationMapController ~ zoomLevel:', zoomLevel);
  };

  return {mapRef, setMapToCurrentLocation, onRegionChangeComplete};
};

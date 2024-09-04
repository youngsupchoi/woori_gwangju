import React, {useEffect, useState} from 'react';
import MapView, {Marker, MapPressEvent, Region} from 'react-native-maps';
import {View, Image} from 'native-base';
import {useRecoilState, useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';
import Config from 'react-native-config';
import axios from 'axios';
import {
  IsActionSheetOpen,
  SelectedLocationState,
  ShowMarkerState,
} from 'state/HomeMapAtoms';
import TouchedLocationMarker from 'components/map/marker/TouchedLocationMarker';
import ForDisabledToiletLocationMarker from 'components/map/marker/ForDisabledToiletLocationMarker';
import ToiletLocationMarker from 'components/map/marker/ToiletLocationMarker';
import subwayStations from '../../subwayDatabase/subwayStation.json'; // 지하철 역 데이터 가져오기
import busStations from '../../busDatabase/busStation.json'; // 버스 정류장 데이터 가져오기
import subwayMarkerIcon from '../../assets/images/MapPin-Metro.png'; // 지하철 PNG 아이콘
import busMarkerIcon from '../../assets/images/MapPin-BUS.png'; // 버스 PNG 아이콘
import ForDisabledToiletLocationMarker from 'components/map/marker/ForDisabledToiletLocationMarker';
import ToiletLocationMarker from 'components/map/marker/ToiletLocationMarker';

const MainMapComponent: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
}> = ({mapRef, onRegionChangeComplete}) => {
  const currentLocation = useRecoilValue(locationState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(
    SelectedLocationState,
  );
  const [isActionSheetOpen, setIsActionSheetOpen] =
    useRecoilState(IsActionSheetOpen);
  const showMarkerState = useRecoilValue(ShowMarkerState); // Marker 상태 가져오기
  const [visibleBusStations, setVisibleBusStations] = useState([]); // 가시 영역 내의 버스 정류장 상태

  // TMAP API KEY 가져오기
  const TMAP_API_KEY = Config.TMAP_API_KEY;

  // 지도 영역이 변경될 때 호출되는 함수로, 가시 영역 내의 버스 정류장을 필터링합니다.
  const handleRegionChangeComplete = (region: Region) => {
    onRegionChangeComplete(region); // 기존의 함수 호출
    filterBusStations(region); // 가시 영역 내 버스 정류장 필터링
  };

  // 현재 가시 영역 내에 있는 버스 정류장만 필터링하는 함수
  const filterBusStations = (region: Region) => {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

    const minLatitude = latitude - latitudeDelta / 2;
    const maxLatitude = latitude + latitudeDelta / 2;
    const minLongitude = longitude - longitudeDelta / 2;
    const maxLongitude = longitude + longitudeDelta / 2;

    const filteredBusStations = busStations.filter(station => {
      return (
        station.gpslati >= minLatitude &&
        station.gpslati <= maxLatitude &&
        station.gpslong >= minLongitude &&
        station.gpslong <= maxLongitude
      );
    });

    setVisibleBusStations(filteredBusStations);
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;

    try {
      // TMap Reverse Geocoding API 호출
      const response = await axios.get(
        `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${latitude}&lon=${longitude}&coordType=WGS84GEO&addressType=A10&appKey=${TMAP_API_KEY}`,
      );

      const {
        city_do,
        gu_gun,
        eup_myeon,
        adminDong,
        ri,
        roadName,
        buildingIndex,
        fullAddress,
        buildingName,
      } = response.data.addressInfo || {};

      // 위치 정보 설정
      setSelectedLocation({
        city_do,
        gu_gun,
        eup_myeon,
        adminDong,
        ri,
        roadName,
        buildingIndex,
        buildingName,
        fullAddress,
        latitude,
        longitude,
      });

      // ActionSheet 열기
      setIsActionSheetOpen(true);
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
    }
  };

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
        onRegionChangeComplete={handleRegionChangeComplete} // 가시 영역 내 필터링
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        onPress={handleMapPress}>
        {/* 현재 위치 마커 표시 */}
        <CurrentLocationMarker />

        {/* 터치한 위치에 마커 표시 */}
        {selectedLocation && isActionSheetOpen && <TouchedLocationMarker />}
        {/* 화장실 마커 표시 */}
        <ToiletLocationMarker />
        {/* 장애인 화장실 마커 표시 */}
        <ForDisabledToiletLocationMarker />
        {/* 지하철 마커 표시 */}
        {showMarkerState.includes('지하철') &&
          subwayStations.map(station => (
            <Marker
              key={station.code}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              title={station.name}>
              <Image
                source={subwayMarkerIcon} // 지하철 PNG 이미지
                alt="Subway Station"
                style={{width: 40, height: 40}} // 원하는 크기 설정
              />
            </Marker>
          ))}

        {/* 버스 정류장 마커 표시 */}
        {showMarkerState.includes('버스') &&
          visibleBusStations.map(station => (
            <Marker
              key={station.nodeid}
              coordinate={{
                latitude: station.gpslati,
                longitude: station.gpslong,
              }}
              title={station.nodenm}>
              <Image
                source={busMarkerIcon} // 버스 PNG 이미지
                alt="Bus Station"
                style={{width: 40, height: 40}} // 원하는 크기 설정
              />
            </Marker>
          ))}
        {/* 화장실 마커 표시 */}
        <ToiletLocationMarker />
        {/* 장애인 화장실 마커 표시 */}
        <ForDisabledToiletLocationMarker />
      </MapView>
    </View>
  );
};

export default MainMapComponent;

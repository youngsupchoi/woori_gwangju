import React, {useState} from 'react';
import MapView, {Marker, MapPressEvent} from 'react-native-maps';
import {View, ActionSheet, Text, Button} from 'native-base';
import {useRecoilState, useRecoilValue} from 'recoil';
import {locationState} from 'state/locationState';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';
import Config from 'react-native-config'; // react-native-config를 사용해 환경 변수 불러오기
import axios from 'axios'; // HTTP 요청을 위한 axios 사용
import {IsActionSheetOpen, SelectedLocationState} from 'state/HomeMapAtoms';

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

  // TMAP API KEY 가져오기
  const TMAP_API_KEY = Config.TMAP_API_KEY;

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
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        onPress={handleMapPress} // 지도 터치 이벤트 처리
      >
        <CurrentLocationMarker />
        {selectedLocation && isActionSheetOpen && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="선택한 위치"
            description={selectedLocation.address}
          />
        )}
      </MapView>
    </View>
  );
};

export default MainMapComponent;

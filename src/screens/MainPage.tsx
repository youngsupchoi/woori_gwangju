import React, {useEffect} from 'react';
import {VStack} from 'native-base';
import FilterButtons from 'components/mainpage/FilterButtons';
import MainSearchBar from 'components/mainpage/MainSearchbar';
import {useNavigation} from '@react-navigation/native';
import MainMapComponent from '../components/map/MainMapComponent';
import {useCurrentLocationMapController} from 'hooks/mapController/useCurrentLocationMapController';
import CurrentLocationButtonComponent from 'components/map/CurrentLocationButtonComponent';
import SelectedLocationActionSheet from 'components/mainpage/SelectedLocationActionSheet';
// import {useRecoilState} from 'recoil';

const MainPage = () => {
  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();
  // const [, setSearchKeyword] = useRecoilState(searchKeywordState);
  const navigation = useNavigation();

  useEffect(() => {
    setMapToCurrentLocation(8);
  }, []);
  return (
    <VStack flex={1} bg="blue.400" p={0} m={0} position={'relative'}>
      {/* 검색 바 */}
      <MainSearchBar
        onFocus={() => navigation.navigate('Search')}
        flex={1}
        showMenuButton={true}
      />
      {/* 필터 버튼들 */}
      <FilterButtons />
      {/* 지도 Placeholder */}
      <MainMapComponent
        mapRef={mapRef}
        onRegionChangeComplete={onRegionChangeComplete}
      />
      {/* 현재위치 버튼 */}
      <CurrentLocationButtonComponent
        onPressFunction={setMapToCurrentLocation}
        upPosition={0}
      />
      <SelectedLocationActionSheet />
    </VStack>
  );
};

export default MainPage;

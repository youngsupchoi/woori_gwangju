import React from 'react';
import {Button, VStack, Image} from 'native-base';
import targetIcon from '../assets/images/target.png';
import FilterButtons from 'components/mainpage/FilterButtons';
import MainSearchBar from 'components/mainpage/MainSearchbar';
import {searchKeywordState} from 'state/SearchAtoms';
import {useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';
import MainMapComponent from '../components/map/MainMapComponent';
import {useCurrentLocationMapController} from 'hooks/mapController/useCurrentLocationMapController';
import CurrentLocationButtonComponent from 'components/map/CurrentLocationButtonComponent';

const MainPage = () => {
  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();
  const [, setSearchKeyword] = useRecoilState(searchKeywordState);
  const navigation = useNavigation();
  return (
    <VStack flex={1} bg="blue.400" p={0} m={0} position={'relative'}>
      {/* 검색 바 */}

      <MainSearchBar onFocus={() => navigation.navigate('Search')} flex={1} />

      {/* 필터 버튼들 */}
      <FilterButtons />

      {/* 지도 Placeholder */}
      <MainMapComponent
        mapRef={mapRef}
        onRegionChangeComplete={onRegionChangeComplete}
      />

      {/* <Button
        position={'absolute'}
        bottom={30}
        right={0}
        p={'10px'}
        m={18}
        _focus={{bg: 'gray.200'}}
        _pressed={{bg: 'gray.300'}}
        bg={'gray.100'}
        borderRadius={'full'}
        onPress={() => setMapToCurrentLocation(20)}>
        <Image
          source={targetIcon}
          alt="target"
          style={{width: 28, height: 28}}
        />
      </Button> */}
      <CurrentLocationButtonComponent
        onPressFunction={setMapToCurrentLocation}
      />
    </VStack>
  );
};

export default MainPage;

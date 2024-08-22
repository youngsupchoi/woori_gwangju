import React from 'react';
import {View, Text, HStack, Image} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, TouchableOpacity} from 'react-native';
import LeftChevron from '../assets/images/leftChevron.png';
import CloseButton from '../assets/images/closeIcon.png';
import {useRecoilValue} from 'recoil';
import {DestinationState} from 'state/RouteAtoms';
import SearchResultMapComponent from 'components/map/SearchResultMapComponent';
import {useCurrentLocationMapController} from 'hooks/mapController/useCurrentLocationMapController';
import SearchResultPageBottomSheetComponent from 'components/searchpage/SearchResultPageBottomSheetComponent';

const SearchResultPage = () => {
  const navigation = useNavigation();
  const destination = useRecoilValue(DestinationState); // Recoil에서 목적지 정보 가져오기
  console.log('🚀 ~ SearchResultPage ~ destination:', destination);

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();

  return (
    <View flex={1} bg="white">
      {/* Header */}
      <HStack
        px={4}
        py={4}
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        borderBottomWidth={1}
        borderBottomColor="gray.200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          _pressed={{backgroundColor: 'transparent'}}>
          <Image
            source={LeftChevron}
            alt="back"
            width={'32px'}
            height={'32px'}
          />
        </TouchableOpacity>
        <Text fontSize="18" bold isTruncated maxWidth="80%">
          {destination.name}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={CloseButton}
            alt="close"
            width={'24px'}
            height={'24px'}
          />
        </TouchableOpacity>
      </HStack>

      {/* 지도 */}
      {/* <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title={destination.name}
        />
      </MapView> */}

      <SearchResultMapComponent
        destination={destination}
        mapRef={mapRef}
        onRegionChangeComplete={onRegionChangeComplete}
      />

      <SearchResultPageBottomSheetComponent />
    </View>
  );
};

export default SearchResultPage;

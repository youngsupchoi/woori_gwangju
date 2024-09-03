import React, {useEffect, useState} from 'react';
import {Actionsheet, Button, Text, View} from 'native-base';
import {useRecoilState, useRecoilValue} from 'recoil';
import {IsActionSheetOpen, SelectedLocationState} from 'state/HomeMapAtoms';
import {locationState} from 'state/locationState';
import haversine from 'haversine';
import {DestinationState} from 'state/RouteAtoms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import {getWalkingRoute} from 'apis/getWalkingRoute';

const SelectedLocationActionSheet = () => {
  const [isActionSheetOpen, setIsActionSheetOpen] =
    useRecoilState(IsActionSheetOpen);
  const [selectedLocation, setSelectedLocation] = useRecoilState(
    SelectedLocationState,
  );
  const currentLocation = useRecoilValue(locationState);
  const [distance, setDistance] = useState(null);
  const [destination, setDestinationState] = useRecoilState(DestinationState);
  const [walkingRouteData, setWalkingRouteData] =
    useRecoilState(walkingRouteAtom);
  const navigation = useNavigation();

  const handlePress = async () => {
    // Recoil 상태에 선택된 목적지 설정
    setDestinationState({
      name: selectedLocation.buildingName,
      longitude: selectedLocation.longitude,
      latitude: selectedLocation.latitude,
      address: selectedLocation.fullAddress,
    });

    try {
      // 객체를 문자열로 변환하여 저장
      const recentSearches = await AsyncStorage.getItem('recentSearches');
      let recentSearchesArray = recentSearches
        ? JSON.parse(recentSearches)
        : [];

      // 동일한 항목이 있는지 확인하고 제거
      recentSearchesArray = recentSearchesArray.filter(
        search =>
          search.name !== selectedLocation.buildingName ||
          search.longitude !== selectedLocation.longitude ||
          search.latitude !== selectedLocation.latitude,
      );

      //   // 새로운 검색어를 맨 위에 추가
      recentSearchesArray.unshift({
        name: selectedLocation.buildingName,
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        address: selectedLocation.fullAddress,
      });

      // 최근 검색어가 20개를 초과하면 오래된 항목 제거
      if (recentSearchesArray.length > 20) {
        recentSearchesArray = recentSearchesArray.slice(0, 20);
      }

      // 업데이트된 배열을 다시 저장
      await AsyncStorage.setItem(
        'recentSearches',
        JSON.stringify(recentSearchesArray),
      );

      const walkingRoute = await getWalkingRoute(
        {
          startX: currentLocation.longitude,
          startY: currentLocation.latitude,
          endX: selectedLocation.longitude,
          endY: selectedLocation.latitude,
          startName: '출발지',
          endName: '도착지',
        },
        1,
      );
      setWalkingRouteData(walkingRoute);
      navigation.navigate('Route');
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }

    // SearchResultPage로 이동
    navigation.navigate('Route');
    setIsActionSheetOpen(false);
  };

  useEffect(() => {
    if (
      selectedLocation?.latitude &&
      selectedLocation?.longitude &&
      currentLocation?.latitude &&
      currentLocation?.longitude
    ) {
      // 현재 위치와 선택된 위치 간의 거리 계산 (m 단위)
      const calculatedDistanceInMeters = haversine(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        {unit: 'meter'}, // 거리 단위 설정 (m)
      );

      // 1km 이상이면 km 단위로, 그 외에는 m 단위로 표시
      if (calculatedDistanceInMeters >= 1000) {
        setDistance(`${(calculatedDistanceInMeters / 1000).toFixed(1)} km`);
      } else {
        setDistance(`${Math.round(calculatedDistanceInMeters)} m`);
      }
    }
  }, [selectedLocation, currentLocation]);

  return (
    <Actionsheet
      isOpen={isActionSheetOpen}
      onClose={() => setIsActionSheetOpen(false)}>
      <Actionsheet.Content textAlign={'left'}>
        <View p={'18px'} w={'100%'}>
          <View justifyContent={'space-between'} flexDir={'row'} mb={'8px'}>
            <Text fontWeight={'semibold'} fontSize={'20px'}>
              {selectedLocation?.buildingName !== ''
                ? selectedLocation.buildingName
                : `${selectedLocation.roadName} ${selectedLocation.buildingIndex}`}
            </Text>
            {/* 선택된 위치와 현재 위치 간의 거리 표시 */}
            <Text fontWeight={'bold'} fontSize={'20px'} color={'#0588F0'}>
              {distance ? distance : '거리 계산 중...'}
            </Text>
          </View>
          <Text fontWeight={'regular'} color={'#80838D'} fontSize={'16px'}>
            {selectedLocation?.city_do} {selectedLocation?.gu_gun}{' '}
            {selectedLocation?.eup_myeon}
            {selectedLocation.adminDong} {selectedLocation.ri}
            {selectedLocation.roadName} {selectedLocation.buildingIndex}
          </Text>
          <Button
            bg={'#113264'}
            borderRadius={'10px'}
            py={'18px'}
            mt={'12px'}
            _pressed={{bg: '#113264', opacity: 0.9}}
            onPress={handlePress}>
            <Text color={'#fff'} fontWeight={'semibold'} fontSize={'16px'}>
              도착지로 설정하기
            </Text>
          </Button>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default SelectedLocationActionSheet;

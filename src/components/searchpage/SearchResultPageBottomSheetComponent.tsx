import React from 'react';
import {View, Text, Button, HStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {DestinationState} from 'state/RouteAtoms';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import {locationState} from 'state/locationState';
import {getWalkingRoute} from 'apis/getWalkingRoute';

const SearchResultPageBottomSheetComponent = () => {
  // 도착지로 선택하기 버튼 눌렀을때 실행될 함수, 현재 위치와 목적지 정보를 가지고 getWalkingRoute 함수를 호출하여 도보경로를 atom에 저장, 그 후 RoutePage로 이동
  const buttonPressHandler = async () => {
    const walkingRoute = await getWalkingRoute(
      {
        startX: currentLocation.longitude,
        startY: currentLocation.latitude,
        endX: destination.longitude,
        endY: destination.latitude,
        startName: '출발지',
        endName: '도착지',
      },
      1,
    );
    setWalkingRouteData(walkingRoute);
    navigation.navigate('Route');
  };

  const destination = useRecoilValue(DestinationState); // Recoil에서 목적지 정보 가져오기
  const [walkingRouteData, setWalkingRouteData] =
    useRecoilState(walkingRouteAtom);
  const [currentLocation, setCurrentLocation] = useRecoilState(locationState);
  const navigation = useNavigation();
  return (
    <View px={4} py={4} bg="white" position="absolute" bottom={0} width="100%">
      <Text fontSize="20" bold isTruncated>
        {destination.name}
      </Text>
      <Text fontSize={'16'} color="gray.500" isTruncated>
        {destination.address}
      </Text>

      <HStack space={4} mt={8}>
        <Button
          flex={1}
          bg={'#F0F0F3'}
          _text={{color: '#1C2024', fontSize: '16', fontWeight: 'semibold'}}
          borderRadius={'xl'}
          h={'56px'}
          onPress={() => navigation.goBack()}>
          돌아가기
        </Button>
        <Button
          flex={1}
          bg={'#113264'}
          _text={{color: '#ffffff', fontSize: '16', fontWeight: 'semibold'}}
          borderRadius={'xl'}
          h={'56px'}
          onPress={() => {
            console.log(
              '🚀 ~ SearchResultPageBottomSheetComponent ~ currentLocation:',
              currentLocation,
            );
            console.log(
              '🚀 ~ SearchResultPageBottomSheetComponent ~ destination:',
              destination,
            );

            console.log(
              '🚀 ~ SearchResultPageBottomSheetComponent ~ walkingRouteData:',
              walkingRouteData,
            );
            buttonPressHandler();
            // navigation.navigate('Route'); // RoutePage로 이동
          }}>
          도착지로 선택하기
        </Button>
      </HStack>
    </View>
  );
};

export default SearchResultPageBottomSheetComponent;

import React from 'react';
import {VStack, Text, HStack, View, Image} from 'native-base';
import SearchResultLocationIcon from 'assets/images/searchResultLocationIcon.png';

const RouteLocationMarker = () => (
  <VStack
    space={1}
    w={'20px'}
    mr={'10px'}
    position={'absolute'}
    top={'12px'}
    bottom={'12px'}
    alignItems={'center'}
    left={'12px'}
    flex={1}
    justifyContent={'space-between'}>
    <Image
      source={SearchResultLocationIcon}
      alt="location-marker"
      size="20px"
    />
    <View w={'2px'} flex={1} bg={'#CDCED6'} />
    <Image
      source={SearchResultLocationIcon}
      alt="location-marker"
      size="20px"
    />
  </VStack>
);

const RouteDetails = () => (
  <VStack space={1}>
    <HStack space={1} alignItems="center">
      <Text fontSize="18px" color="#1C2024">
        배명중고교
      </Text>
    </HStack>
    <HStack space={1} alignItems="center">
      <Text fontSize="16" fontWeight="medium">
        3422
      </Text>
      <Text fontSize="16" color="red.500">
        2분 12초
      </Text>
    </HStack>
    <HStack space={1} alignItems="center">
      <Text fontSize="18px" color="#1C2024">
        삼성역3번출구 정류장
      </Text>
    </HStack>
  </VStack>
);

const WalkRouteComponent = () => (
  <>
    {[1, 2, 3].map((item, index) => (
      <VStack key={index} pt={'16px'}>
        <Text fontSize="24px" fontWeight="bold" px={4}>
          1시간 29분
        </Text>
        <HStack
          justifyContent="flex-start"
          position={'relative'}
          alignItems="center"
          borderRadius={'8px'}
          py={'12px'}
          pl={'44px'}
          px={'12px'}
          mx={'18px'}
          mt={'10px'}
          mb={'16px'}
          bg={'#F0F0F3'}>
          <RouteLocationMarker />
          <RouteDetails />
        </HStack>
        <View bg={'#E8E8EC'} h={'8px'} w={'full'} />
      </VStack>
    ))}
  </>
);

export default WalkRouteComponent;

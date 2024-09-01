import React from 'react';
import {VStack, Text, Image, Center} from 'native-base';
import wrongMap from '../../assets/images/wrongMap.png';

const ConstraintTransportRouteComponent = () => {
  return (
    <Center flex={1} bg="white">
      <VStack space={4} alignItems="center">
        <Image
          source={wrongMap} // 실제 이미지 경로로 변경하세요.
          alt="Route Constraint Image"
        />
        <Text color="gray.400" fontSize="xs" textAlign="center">
          광주 외 지역이 도착/출발지인 경우{'\n'}
          대중교통 길찾기가 제공되지 않습니다.
        </Text>
      </VStack>
    </Center>
  );
};

export default ConstraintTransportRouteComponent;
